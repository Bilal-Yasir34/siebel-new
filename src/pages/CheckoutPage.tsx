import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Banknote, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { supabase } from '@/lib/supabase';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Address } from '@/types';

const steps = [
  { id: 'address', title: 'Shipping Address' },
  { id: 'payment', title: 'Payment' },
  { id: 'review', title: 'Review Order' },
];

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    items,
    coupon,
    subtotal,
    discount,
    shipping,
    total,
    clearCart,
    removeCoupon,
  } = useCartStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Re-validate any already-applied coupon in case the admin deleted,
  // deactivated, or it expired since it was added to the cart.
  useEffect(() => {
    if (!coupon) return;

    const revalidate = async () => {
      const { data } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', coupon.id)
        .eq('is_active', true)
        .maybeSingle();

      const stillValid = data && new Date(data.end_date) >= new Date() && new Date(data.start_date) <= new Date();

      if (!stillValid) {
        removeCoupon();
        toast.error('Your coupon is no longer valid and has been removed.');
      }
    };

    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupon?.id]);

  // Form states
  const [address, setAddress] = useState<Partial<Address>>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray" />
          <h1 className="font-heading text-heading-2 text-dark mb-2">
            No Items to Checkout
          </h1>
          <p className="text-gray mb-6">Add some products to your cart first.</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const validateAddress = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!address.first_name) newErrors.first_name = 'First name is required';
    if (!address.last_name) newErrors.last_name = 'Last name is required';
    if (!address.email) newErrors.email = 'Email is required';
    if (!address.phone) newErrors.phone = 'Phone is required';
    if (!address.address_line1) newErrors.address_line1 = 'Address is required';
    if (!address.city) newErrors.city = 'City is required';
    if (!address.postal_code) newErrors.postal_code = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean => {
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateAddress()) return;
    if (currentStep === 1 && !validatePayment()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);

    try {
      const orderNumber = generateOrderNumber();

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          status: 'pending',
          subtotal,
          discount_amount: discount,
          shipping_amount: shipping,
          tax_amount: 0,
          total,
          coupon_id: coupon?.id || null,
          shipping_address: address,
          billing_address: address,
          payment_method: paymentMethod,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Order INSERT error:', error.code, error.message, error.details, error.hint);
        throw error;
      }

      if (order) {
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          product_image: item.product.images?.[0],
          quantity: item.quantity,
          price: item.product.price,
          discount_price: item.product.discount_price,
          total: (item.product.discount_price || item.product.price) * item.quantity,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) {
          console.error('Order items INSERT error:', itemsError.code, itemsError.message, itemsError.details, itemsError.hint);
          throw itemsError;
        }

        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name *</label>
                <input
                  type="text"
                  value={address.first_name || ''}
                  onChange={(e) =>
                    setAddress({ ...address, first_name: e.target.value })
                  }
                  className={`input ${errors.first_name ? 'input-error' : ''}`}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500 mt-1">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input
                  type="text"
                  value={address.last_name || ''}
                  onChange={(e) =>
                    setAddress({ ...address, last_name: e.target.value })
                  }
                  className={`input ${errors.last_name ? 'input-error' : ''}`}
                />
              </div>
            </div>

            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                value={address.email || ''}
                onChange={(e) => setAddress({ ...address, email: e.target.value })}
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
            </div>

            <div>
              <label className="label">Phone *</label>
              <input
                type="tel"
                value={address.phone || ''}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className={`input ${errors.phone ? 'input-error' : ''}`}
              />
            </div>

            <div>
              <label className="label">Address *</label>
              <input
                type="text"
                value={address.address_line1 || ''}
                onChange={(e) =>
                  setAddress({ ...address, address_line1: e.target.value })
                }
                placeholder="Street address"
                className={`input ${errors.address_line1 ? 'input-error' : ''}`}
              />
            </div>

            <div>
              <label className="label">Apartment, suite, etc.</label>
              <input
                type="text"
                value={address.address_line2 || ''}
                onChange={(e) =>
                  setAddress({ ...address, address_line2: e.target.value })
                }
                className="input"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">City *</label>
                <input
                  type="text"
                  value={address.city || ''}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className={`input ${errors.city ? 'input-error' : ''}`}
                />
              </div>
              <div>
                <label className="label">State</label>
                <input
                  type="text"
                  value={address.state || ''}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="label">Postal Code *</label>
                <input
                  type="text"
                  value={address.postal_code || ''}
                  onChange={(e) =>
                    setAddress({ ...address, postal_code: e.target.value })
                  }
                  className={`input ${errors.postal_code ? 'input-error' : ''}`}
                />
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-6 border rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? 'border-pink-DEFAULT bg-pink-50'
                      : 'border-secondary-200 hover:border-pink-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="w-5 h-5 text-pink-DEFAULT"
                  />
                  <method.icon className="w-8 h-8 text-pink-DEFAULT" />
                  <div>
                    <span className="font-medium text-lg">{method.name}</span>
                    <p className="text-sm text-gray mt-1">Pay when your order arrives at your doorstep</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-pink-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-gray-dark">
                <span className="font-medium text-dark">Note:</span> Cash on Delivery is available across Pakistan. Please keep exact change ready for a smooth delivery experience.
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Shipping Address */}
            <div className="bg-secondary-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Shipping Address</h3>
                <button
                  onClick={() => setCurrentStep(0)}
                  className="text-sm text-pink-DEFAULT hover:text-pink-dark"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray text-sm">
                {address.first_name} {address.last_name}
                <br />
                {address.address_line1}
                {address.address_line2 && <>, {address.address_line2}</>}
                <br />
                {address.city}, {address.state} {address.postal_code}
              </p>
            </div>

            {/* Payment Method */}
            <div className="bg-secondary-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Payment Method</h3>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-sm text-pink-DEFAULT hover:text-pink-dark"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray text-sm">
                Cash on Delivery
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-secondary-50 rounded-xl p-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product.images?.[0] || '/placeholder-product.jpg'}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(
                        (item.product.discount_price || item.product.price) *
                          item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container-custom py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray hover:text-dark mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="font-heading text-heading-1 text-dark">Checkout</h1>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? 'bg-pink-DEFAULT text-coral-dark'
                      : index === currentStep
                      ? 'bg-pink-DEFAULT text-coral-dark'
                      : 'bg-secondary-200 text-gray'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 hidden sm:block text-sm ${
                    index <= currentStep ? 'text-dark' : 'text-gray'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-12 sm:w-24 h-px bg-secondary-200 mx-2 sm:mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6">{renderStep()}</div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="btn-secondary"
                >
                  Back
                </button>
              )}
              {currentStep < 2 ? (
                <button onClick={handleNext} className="btn-primary flex-1">
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="btn-primary btn-lg flex-1"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-32">
              <h2 className="font-heading text-heading-3 text-dark mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product.images?.[0] || '/placeholder-product.jpg'}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(
                        (item.product.discount_price || item.product.price) *
                          item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-secondary-200">
                <div className="flex items-center justify-between text-sm text-gray">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-gray">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-secondary-200">
                  <span className="font-heading text-lg text-dark">Total</span>
                  <span className="font-heading text-2xl text-dark">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
