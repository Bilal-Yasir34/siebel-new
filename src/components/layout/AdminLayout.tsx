import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Image,
  ChevronLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Logo } from '@/components/ui/Logo';
import { useState } from 'react';

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Coupon Codes', href: '/admin/coupons', icon: Tag },
  { name: 'Popup Banner', href: '/admin/banner', icon: Image },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isLinkActive = (href: string) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white shadow-soft z-50 flex flex-col transition-all duration-300
          w-64 ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            {(isSidebarOpen || isMobileMenuOpen) && <Logo size="sm" />}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <ChevronLeft
                className={`w-5 h-5 text-gray transition-transform ${
                  !isSidebarOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            const showLabel = isSidebarOpen || isMobileMenuOpen;

            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray hover:bg-secondary-100 hover:text-dark'
                }`}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {showLabel && <span className="font-medium">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-secondary-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-500 font-medium">
                {user?.first_name?.charAt(0) || 'A'}
              </span>
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark truncate">
                  {user?.first_name || 'Admin'}
                </p>
                <p className="text-sm text-gray truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray hover:text-red-500 transition-colors rounded-lg"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 w-full min-w-0 ml-0 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white shadow-soft sticky top-0 z-30">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray hover:text-dark flex-shrink-0"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="font-heading text-lg sm:text-2xl text-dark truncate">
                {adminLinks.find((l) => isLinkActive(l.href))?.name || 'Admin'}
              </h1>
            </div>
            <Link
              to="/"
              className="text-xs sm:text-sm text-gray hover:text-primary-500 transition-colors flex-shrink-0"
            >
              View Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
