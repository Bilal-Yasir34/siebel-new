import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Settings, ChevronRight, LogOut, Edit2 } from 'lucide-react';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabase';
import { ListCardSkeleton } from '@/components/ui/Skeleton';
import { formatDate, formatPrice, getInitials } from '@/lib/utils';
import type { Order } from '@/types';

const menuItems = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function ProfilePage() {
  const location = useLocation();
  const { user, logout, updateProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState(
    location.pathname === '/my-orders' ? 'orders' : 'profile'
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (activeSection === 'orders') {
      fetchOrders();
    }
  }, [activeSection]);

  const fetchOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const { error } = await updateProfile(formData);
    if (!error) {
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="bg-white rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-heading-2 text-dark">My Profile</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="btn-ghost btn-sm"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!editing}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!editing}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input bg-secondary-100"
                />
              </div>

              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="input"
                />
              </div>

              {editing && (
                <div className="flex gap-4">
                  <button onClick={handleUpdateProfile} className="btn-primary">
                    Save Changes
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-4">
            <h2 className="font-heading text-heading-2 text-dark mb-6">My Orders</h2>

            {isLoading ? (
              <ListCardSkeleton count={3} />
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray mb-4" />
                <p className="text-gray">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-dark">{order.order_number}</p>
                      <p className="text-sm text-gray">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`badge ${
                      order.status === 'completed' ? 'badge-success' :
                      order.status === 'cancelled' ? 'badge-error' :
                      'badge-primary'
                    }`}>
                      {order.status === 'processing' ? 'In Progress' : order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray">{order.items?.length || 0} items</p>
                    <p className="font-medium text-dark">{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2 className="font-heading text-heading-2 text-dark mb-6">Account Settings</h2>
            <div className="bg-white rounded-2xl p-8 space-y-6">
              <div>
                <h3 className="font-medium text-dark mb-4">Account Actions</h3>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-red-500 border-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray">This section is coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-purple-DEFAULT text-white">
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-semibold">
              {getInitials(user?.first_name, user?.last_name)}
            </div>
            <div>
              <h1 className="font-heading text-heading-1 text-white">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Welcome'}
              </h1>
              <p className="text-white/80">{user?.email}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl p-4 space-y-1 sticky top-32">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    activeSection === item.id
                      ? 'bg-pink-100 text-pink-DEFAULT'
                      : 'text-gray hover:bg-secondary-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${activeSection === item.id ? 'text-pink-DEFAULT' : ''}`} />
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
