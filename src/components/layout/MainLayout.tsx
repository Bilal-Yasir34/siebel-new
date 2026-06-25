import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { DesktopNav } from './DesktopNav';
import { Footer } from './Footer';
import { BackToTop } from '@/components/ui/BackToTop';
import { PromoBannerModal } from '@/components/ui/PromoBannerModal';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBannerModal />
      <Header />
      <DesktopNav />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 pt-[85px] lg:pt-[129px]"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <BackToTop />
    </div>
  );
}
