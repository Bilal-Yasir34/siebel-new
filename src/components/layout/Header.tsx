import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCartStore, useUIStore, useAuthStore } from '@/store';
import { Logo } from '@/components/ui/Logo';
import { SearchModal } from '@/components/ui/SearchModal';

const mobileNav = [
  { name: 'Home', href: '/' },
  { name: 'All Products', href: '/products' },
  {
    name: 'Categories',
    children: [
      { name: 'Whitening Cream', href: '/products?category=whitening-cream' },
      { name: 'Face Wash', href: '/products?category=face-wash' },
      { name: 'Serums', href: '/products?category=serums' },
      { name: 'Sunblock', href: '/products?category=sunblock' },
      { name: 'Body Lotion', href: '/products?category=body-lotion' },
    ],
  },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { isMobileMenuOpen, isScrolled, setMobileMenuOpen, setScrolled, setSearchOpen } = useUIStore();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // When scrolled, the header becomes a light blue frosted glass — so icons
  // and text need to switch from white to dark navy to stay visible.
  const iconColorClass = isScrolled
    ? 'text-dark/70 hover:text-dark'
    : 'text-white/80 hover:text-white';
  const hamburgerColorClass = isScrolled ? 'text-dark' : 'text-white';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrolled]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-primary-100/85 backdrop-blur-medium shadow-elevated' : 'bg-purple-900'
        }`}
      >
        {/* Top Banner — scrolling announcement ticker */}
        <div
          className={`group overflow-hidden py-1.5 text-xs tracking-wide border-b transition-colors duration-300 ${
            isScrolled
              ? 'bg-primary-200/80 text-dark/80 border-primary-300/60'
              : 'bg-purple-800 text-white/90 border-purple-dark'
          }`}
        >
          <div className="flex w-max animate-marquee">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center shrink-0">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="px-6 whitespace-nowrap">
                    Free Shipping on Orders Above Rs. 1,500 • Cash on Delivery Available Nationwide
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Header Row */}
        <div className="container-custom">
          <div className="flex items-center justify-between h-14">

            {/* Hamburger — mobile only */}
            <button
              className={`lg:hidden p-2 -ml-2 transition-colors ${hamburgerColorClass}`}
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Logo className="flex-shrink-0" />

            {/* Spacer on desktop so icons sit on the right */}
            <div className="hidden lg:flex flex-1" />

            {/* Right Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 transition-colors ${iconColorClass}`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/cart"
                className={`relative p-2 transition-colors ${iconColorClass}`}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-DEFAULT text-coral-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Link
                  to={isAdmin ? '/admin' : '/profile'}
                  className={`p-2 transition-colors ${iconColorClass}`}
                  aria-label="Account"
                >
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Link>
              ) : (
                <Link to="/login" className={`p-2 transition-colors ${iconColorClass}`} aria-label="Sign In">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu — scrollable overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-purple-900 border-t border-purple-dark overflow-hidden"
            >
              {/* Scrollable inner container */}
              <div
                className="overflow-y-auto overscroll-contain"
                style={{ maxHeight: 'calc(100dvh - 88px)' }}
              >
                <div className="container-custom py-4 pb-8 space-y-0.5">
                  {mobileNav.map((item) => (
                    <div key={item.name}>
                      {item.href ? (
                        <Link
                          to={item.href}
                          className={`flex items-center py-3 px-4 text-sm font-semibold rounded-lg ${
                            location.pathname === item.href
                              ? 'text-pink-DEFAULT bg-purple-800'
                              : 'text-white/85 hover:text-white hover:bg-purple-800'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <>
                          <p className="px-4 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            {item.name}
                          </p>
                          {item.children?.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="flex items-center py-2.5 px-4 text-sm text-white/70 hover:text-white hover:bg-purple-800 rounded-lg transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  ))}

                  {!isAuthenticated && (
                    <div className="pt-5 mt-2 border-t border-purple-dark">
                      <Link
                        to="/login"
                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                      >
                        <User className="w-4 h-4" />
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal />
    </>
  );
}
