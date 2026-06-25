import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Tag,
  X,
  AlertCircle,
} from 'lucide-react';
import { useCartStore, SHIPPING_THRESHOLD } from '@/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import type { Coupon } from '@/types';

export function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    coupon,
    subtotal,
    discount,
    shipping,
    total,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Re-validate any already-applied coupon against the live database, in
  // case the admin deleted, deactivated, or expired it after it was applied.
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setCouponError('Invalid coupon code');
        return;
      }

      const couponData = data as Coupon;
      const now = new Date();

      if (new Date(couponData.start_date) > now) {
        setCouponError('This coupon is not yet active');
        return;
      }

      if (new Date(couponData.end_date) < now) {
        setCouponError('This coupon has expired');
        return;
      }

      if (couponData.min_order_value && subtotal < couponData.min_order_value) {
        setCouponError(`Minimum order of ${formatPrice(couponData.min_order_value)} required`);
        return;
      }

      if (couponData.usage_limit && couponData.usage_count >= couponData.usage_limit) {
        setCouponError('This coupon has reached its usage limit');
        return;
      }

      applyCoupon(couponData);
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } catch {
      setCouponError('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-pink-100 flex items-center justify-center"
          >
            <ShoppingBag className="w-12 h-12 text-pink-DEFAULT" />
          </motion.div>
          <h1 className="font-heading text-heading-1 text-dark mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products" className="btn-primary btn-lg">
            Start Shopping <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-heading text-heading-1 text-dark">
              Shopping Cart
            </h1>
            <p className="text-gray mt-2">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map(({ product, quantity }, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/products/${product.slug}`}
                      className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden"
                    >
                      <img
                        src={product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${product.slug}`}
                        className="font-medium text-dark hover:text-pink-DEFAULT transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-gray mt-1">
                        {product.category?.name || 'Skincare'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-medium text-dark">
                          {formatPrice(product.discount_price || product.price)}
                        </span>
                        {product.discount_price && (
                          <span className="text-sm text-gray line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-secondary-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                            className="p-2 hover:bg-secondary-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-center min-w-[40px]">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                            disabled={quantity >= product.stock}
                            className="p-2 hover:bg-secondary-100 transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-2 text-gray hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right hidden sm:block">
                      <p className="font-medium text-dark">
                        {formatPrice(
                          (product.discount_price || product.price) * quantity
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <button
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
              className="text-sm text-gray hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-32">
              <h2 className="font-heading text-heading-3 text-dark mb-6">
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="mb-6">
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-600">
                        {coupon.code}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Enter coupon code"
                        className="input flex-1"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="btn-secondary"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-gray">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-secondary-200 pt-3 flex items-center justify-between">
                  <span className="font-heading text-lg text-dark">Total</span>
                  <span className="font-heading text-2xl text-dark">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < SHIPPING_THRESHOLD && (
                <div className="bg-secondary-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray">
                    Add{' '}
                    <span className="font-medium text-pink-DEFAULT">
                      {formatPrice(SHIPPING_THRESHOLD - subtotal)}
                    </span>{' '}
                    more for free delivery!
                  </p>
                  <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-pink-DEFAULT h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary btn-lg"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block text-center text-sm text-gray hover:text-pink-DEFAULT mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
