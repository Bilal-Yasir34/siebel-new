import { useEffect, useState, Fragment } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TableSkeleton, SkeletonBox } from '@/components/ui/Skeleton';
import { formatPrice, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Order, OrderStatus } from '@/types';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusBadgeClass: Record<OrderStatus, string> = {
  pending: 'badge-primary',
  processing: 'badge-primary',
  completed: 'badge-success',
  cancelled: 'badge-error',
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

    if (error) {
      toast.error('Could not update order status.');
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast.success('Order status updated.');
    }
    setUpdatingId(null);
  };

  return (
    <div>
      {isLoading ? (
        <SkeletonBox className="h-4 w-24 mb-6" />
      ) : (
        <p className="text-gray mb-6">{orders.length} orders</p>
      )}

      <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-secondary-50 text-gray text-left">
            <tr>
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton rows={6} columns={6} />
            ) : (
              orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const customerName = `${order.shipping_address?.first_name || ''} ${order.shipping_address?.last_name || ''}`.trim();

              return (
                <Fragment key={order.id}>
                  <tr className="border-t border-secondary-100">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="text-gray hover:text-dark"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-dark">{order.order_number}</td>
                    <td className="px-4 py-3 text-gray">
                      {customerName || 'Guest'}
                      <div className="text-xs text-gray">{order.shipping_address?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray">{formatDateTime(order.created_at)}</td>
                    <td className="px-4 py-3 font-medium text-dark">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${statusBadgeClass[order.status]}`}>
                          {statusOptions.find((s) => s.value === order.status)?.label || order.status}
                        </span>
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs border border-secondary-200 rounded-lg px-2 py-1"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-secondary-50">
                      <td></td>
                      <td colSpan={5} className="px-4 py-4">
                        <div className="space-y-2 mb-3">
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray">{item.product_name} × {item.quantity}</span>
                              <span className="text-dark font-medium">{formatPrice(item.total)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray">
                          {order.shipping_address?.address_line1}, {order.shipping_address?.city}{' '}
                          {order.shipping_address?.postal_code} · {order.shipping_address?.phone}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
              })
            )}
          </tbody>
        </table>

        {!isLoading && orders.length === 0 && (
          <p className="text-center text-gray py-12">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
