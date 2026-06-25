import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-[10rem] leading-none text-pink-DEFAULT"
        >
          404
        </motion.h1>
        <h2 className="font-heading text-heading-1 text-dark mt-4">
          Page Not Found
        </h2>
        <p className="text-gray mt-2 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <Link to="/products" className="btn-secondary">
            <Search className="w-5 h-5 mr-2" />
            Browse Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
