import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SkeletonBox } from '@/components/ui/Skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', orderId)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setOrder(data as Order);
      }
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 text-center">
            <SkeletonBox className="w-20 h-20 rounded-full mx-auto mb-6" />
            <SkeletonBox className="h-7 w-2/3 mx-auto mb-3" />
            <SkeletonBox className="h-4 w-full mb-1" />
            <SkeletonBox className="h-4 w-4/5 mx-auto mb-8" />

            <div className="bg-secondary-50 rounded-xl p-6 mb-8 text-left space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <SkeletonBox className="h-4 w-28" />
                  <SkeletonBox className="h-4 w-24" />
                </div>
              ))}
            </div>

            <div className="text-left mb-8 space-y-3">
              <SkeletonBox className="h-5 w-20 mb-2" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <SkeletonBox className="h-4 w-40" />
                  <SkeletonBox className="h-4 w-16" />
                </div>
              ))}
            </div>

            <SkeletonBox className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-heading-2 text-dark mb-2">
            We couldn't find that order
          </h1>
          <p className="text-gray mb-6">
            The order link may be incorrect, or the order may have been removed.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="font-heading text-heading-1 text-dark mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-gray mb-8">
            Your order has been placed successfully. We'll send you updates as it
            progresses.
          </p>

          <div className="bg-secondary-50 rounded-xl p-6 mb-8 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray">Order Number</span>
              <span className="font-semibold text-dark">{order.order_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray">Order Date</span>
              <span className="font-medium text-dark">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray">Payment Method</span>
              <span className="font-medium text-dark">Cash on Delivery</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-secondary-200">
              <span className="text-gray">Total</span>
              <span className="font-bold text-lg text-dark">{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="text-left mb-8">
              <h2 className="font-heading text-lg text-dark mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Items
              </h2>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="font-medium text-dark">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to="/products" className="btn-primary w-full flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
