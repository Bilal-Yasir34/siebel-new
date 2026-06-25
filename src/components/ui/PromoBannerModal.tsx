import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PromoBanner } from '@/types';

const AUTO_DISMISS_MS = 5000;

export function PromoBannerModal() {
  const [banner, setBanner] = useState<PromoBanner | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      const { data } = await supabase
        .from('promo_banner')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!data) return;

      const dismissedId = sessionStorage.getItem('promo_banner_dismissed');
      if (dismissedId === data.id) return;

      setBanner(data);
      setIsOpen(true);
    };

    fetchBanner();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => handleClose(), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (banner) {
      sessionStorage.setItem('promo_banner_dismissed', banner.id);
    }
  };

  if (!banner) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              aria-label="Close banner"
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white shadow-elevated flex items-center justify-center text-dark hover:text-primary-500 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {banner.link_url ? (
              <a href={banner.link_url} onClick={handleClose}>
                <img
                  src={banner.image_url}
                  alt="Promotion"
                  className="w-full h-auto rounded-2xl shadow-elevated"
                />
              </a>
            ) : (
              <img
                src={banner.image_url}
                alt="Promotion"
                className="w-full h-auto rounded-2xl shadow-elevated"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
