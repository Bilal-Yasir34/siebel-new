import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const footerLinks = {
  quickLinks: [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  categories: [
    { name: 'Whitening Cream', href: '/products?category=whitening-cream' },
    { name: 'Face Wash', href: '/products?category=face-wash' },
    { name: 'Serums', href: '/products?category=serums' },
    { name: 'Sunblock', href: '/products?category=sunblock' },
    { name: 'Body Lotion', href: '/products?category=body-lotion' },
  ],
  customerService: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-conditions' },
    { name: 'Returns', href: '/shipping-policy#returns' },
  ],
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.297-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.149-.74-1.778-1.013-2.434-.27-.654-.546-.554-.74-.554-.198 0-.487-.025-.74-.025-.226 0-.595.025-.913.025-.32 0-.795.075-1.214.521-.42.446-1.598 1.555-1.598 3.781s1.624 4.4 1.847 4.7c.222.297 2.522 3.853 6.12 5.244 3.6 1.392 3.6.927 4.246.866.645-.06 2.103-.86 2.4-1.69.297-.83.297-1.541.198-1.69-.099-.149-.297-.223-.594-.372z" />
      <path d="M12.04 1.5C6.27 1.5 1.6 6.17 1.6 11.94c0 2.062.59 3.99 1.62 5.65L1.5 22.5l5.05-1.66a10.36 10.36 0 0 0 5.49 1.55c5.77 0 10.44-4.67 10.44-10.44C22.48 6.17 17.81 1.5 12.04 1.5zm0 18.97c-1.78 0-3.49-.49-4.97-1.4l-.36-.22-3 .99.99-2.92-.23-.36a8.5 8.5 0 0 1-1.42-4.66c0-4.71 3.83-8.54 8.54-8.54 4.71 0 8.54 3.83 8.54 8.54 0 4.71-3.83 8.55-8.54 8.55z" />
    </svg>
  );
}

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61563619362263', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/siebel.skincare/', label: 'Instagram' },
  { icon: WhatsAppIcon, href: 'https://wa.me/923279975574', label: 'WhatsApp' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already subscribed.');
        } else {
          toast.error('Could not subscribe right now. Please try again.');
        }
      } else {
        setIsSubscribed(true);
        setEmail('');
        toast.success('Subscribed! Watch your inbox for offers.');
      }
    } catch {
      toast.error('Could not subscribe right now. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-purple-900">
      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div>
              <Logo />
              <p className="mt-4 text-white/70 max-w-sm">
                Reveal Your Natural Glow with our premium skincare collection.
                Discover the science of beautiful skin with Siebel.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href="mailto:siebelskincare@gmail.com"
                  className="flex items-center gap-3 text-white/70 hover:text-pink-DEFAULT transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>siebelskincare@gmail.com</span>
                </a>
                <a
                  href="tel:03279975574"
                  className="flex items-center gap-3 text-white/70 hover:text-pink-DEFAULT transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>0327-9975574</span>
                </a>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-6">
                <h4 className="font-heading text-sm font-semibold mb-2 text-white">
                  Subscribe for offers & updates
                </h4>
                {isSubscribed ? (
                  <p className="text-sm text-pink-DEFAULT">Thanks for subscribing!</p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="flex-1 px-4 py-2.5 rounded-lg bg-purple-800 text-white placeholder:text-white/50 text-sm border border-purple-800 focus:outline-none focus:border-pink-DEFAULT transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      aria-label="Subscribe"
                      className="px-3 rounded-lg bg-pink-DEFAULT text-coral-dark hover:bg-pink-dark hover:text-white transition-colors flex items-center justify-center disabled:opacity-60"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-pink-DEFAULT transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-pink-DEFAULT transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-white">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-pink-DEFAULT transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-purple-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-white/70 hover:bg-pink-DEFAULT hover:text-coral-dark transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <p className="text-white/70 text-sm text-center">
              &copy; {new Date().getFullYear()} Siebel Skincare. All rights reserved.
            </p>

            <p className="text-white/50 text-sm">
              Cash on Delivery Available
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
