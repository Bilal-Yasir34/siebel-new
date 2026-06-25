import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Users, Package, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatDate } from '@/lib/utils';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
  }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch low stock count
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 10)
        .eq('is_active', true);

      // Fetch customers count
      const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      // Fetch orders stats
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total')
        .neq('status', 'cancelled');

      // Fetch recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, order_number, total, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch top products
      const { data: topProducts } = await supabase
        .from('products')
        .select('id, name, price, stock, images')
        .eq('best_seller', true)
        .limit(4);

      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({
        totalRevenue,
        totalOrders: ordersData?.length || 0,
        totalCustomers: customerCount || 0,
        totalProducts: productCount || 0,
        lowStockProducts: lowStockCount || 0,
        recentOrders: recentOrders || [],
        topProducts: topProducts || [],
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      change: '+12.5%',
      isPositive: true,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      change: '+8.2%',
      isPositive: true,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      change: '+5.1%',
      isPositive: true,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      change: `Low stock: ${stats.lowStockProducts}`,
      isPositive: stats.lowStockProducts < 5,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-soft"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium flex items-center gap-1 ${
                    card.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.isPositive ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {card.change}
                  </span>
                </div>
                <h3 className="text-gray text-sm">{card.title}</h3>
                <p className="font-heading text-2xl text-dark mt-1">{card.value}</p>
              </motion.div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-lg font-medium text-dark">Sales Overview</h2>
            <select className="text-sm border border-secondary-200 rounded-lg px-3 py-2">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64 bg-secondary-50 rounded-xl flex items-center justify-center">
            {loading ? (
              <div className="w-full h-full p-4">
                <div className="skeleton w-full h-full rounded-lg" />
              </div>
            ) : (
              <div className="text-center text-gray">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-primary-500" />
                <p>Revenue: {formatPrice(stats.totalRevenue)}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-soft"
        >
          <h2 className="font-heading text-lg font-medium text-dark mb-6">Top Products</h2>
          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 skeleton rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 w-24 skeleton rounded mb-1" />
                    <div className="h-3 w-16 skeleton rounded" />
                  </div>
                </div>
              ))
            ) : stats.topProducts.length === 0 ? (
              <p className="text-gray text-center py-8">No products yet</p>
            ) : (
              stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-100">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark truncate">{product.name}</p>
                    <p className="text-sm text-gray">{formatPrice(product.price)}</p>
                  </div>
                  <span className="text-sm text-gray">#{index + 1}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg font-medium text-dark">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-primary-500 hover:text-primary-600">
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 skeleton rounded" />
              ))}
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <p className="text-gray text-center py-8">No orders yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray border-b border-secondary-200">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-secondary-100">
                    <td className="py-4 font-medium text-dark">{order.order_number}</td>
                    <td className="py-4 text-gray">{formatDate(order.created_at)}</td>
                    <td className="py-4">
                      <span className={`badge ${
                        order.status === 'completed' ? 'badge-success' :
                        order.status === 'cancelled' ? 'badge-error' :
                        'badge-primary'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-medium text-dark">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
