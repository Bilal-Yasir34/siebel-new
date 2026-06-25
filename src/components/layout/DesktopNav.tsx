import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const primaryLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Products', href: '/products' },
  { name: 'Whitening Cream', href: '/products?category=whitening-cream' },
  { name: 'Face Wash', href: '/products?category=face-wash' },
  { name: 'Serums', href: '/products?category=serums' },
  { name: 'Sunblock', href: '/products?category=sunblock' },
];

const moreLinks = [
  { name: 'Body Lotion', href: '/products?category=body-lotion' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function DesktopNav() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const lastScrollY = useRef(0);
  const moreRef = useRef<HTMLDivElement>(null);

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 60) {
        setVisible(true);
      } else if (current > lastScrollY.current + 4) {
        setVisible(false);
        setMoreOpen(false);
      } else if (current < lastScrollY.current - 4) {
        setVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on navigation
  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname, location.search]);

  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === '/'
      : location.pathname + location.search === href ||
        location.pathname === href;

  return (
    <div
      className={`hidden lg:block fixed left-0 right-0 z-40 transition-transform duration-300 ease-smooth ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ top: '85px' }}
    >
      <div className="bg-white border-b border-secondary-300 shadow-soft">
        <div className="container-custom">
          <nav className="flex items-center h-11 gap-1">

            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ${
                  isActive(link.href)
                    ? 'text-coral'
                    : 'text-gray-dark hover:text-coral'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: '#1565C0' }}
                  />
                )}
              </Link>
            ))}

            {/* More dropdown */}
            <div ref={moreRef} className="relative ml-auto flex-shrink-0">
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ${
                  moreOpen ? 'text-coral' : 'text-gray-dark hover:text-coral'
                }`}
              >
                More
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-elevated border border-secondary-200 py-2 z-50"
                  >
                    {moreLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          isActive(link.href)
                            ? 'text-coral font-semibold bg-pink-50'
                            : 'text-gray-dark hover:text-coral hover:bg-secondary-100'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </nav>
        </div>
      </div>
    </div>
  );
}
