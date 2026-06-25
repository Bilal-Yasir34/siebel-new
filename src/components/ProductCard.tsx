import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Star, Check } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, isInCart } = useCartStore();
  const [justAdded, setJustAdded] = useState(false);

  const discount = calculateDiscount(product.price, product.discount_price);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="product-card">
          {/* Image Container */}
          <div className="product-card-image relative">
            <img
              src={product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[85%]">
              {product.best_seller && (
                <span className="bg-green-500 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                  Best Seller
                </span>
              )}
              {product.new_arrival && (
                <span
                  className="text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                  style={{ background: 'linear-gradient(135deg, #0D3B6E 0%, #1565C0 100%)' }}
                >
                  New
                </span>
              )}
              {discount && (
                <span className="text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#6B9EC5' }}>
                  -{discount}%
                </span>
              )}
            </div>

            {/* Desktop: Quick Actions (hover only) */}
            <div className="hidden lg:flex absolute top-3 right-3 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link
                to={`/products/${product.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray hover:bg-pink-DEFAULT hover:text-coral-dark transition-colors shadow-soft"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            {/* Desktop: Animated Add to Cart (hover only) */}
            <div className="hidden lg:flex justify-center absolute bottom-3 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileHover={product.stock !== 0 ? { y: -2 } : undefined}
                whileTap={product.stock !== 0 ? { scale: 0.96 } : undefined}
                className="relative w-full max-w-[220px] h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm text-white overflow-hidden shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: product.stock === 0
                    ? '#8FB3D4'
                    : justAdded
                    ? 'linear-gradient(135deg, #1E8F5F 0%, #1565C0 100%)'
                    : 'linear-gradient(135deg, #0D3B6E 0%, #1565C0 100%)',
                  transition: 'background 0.4s ease',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {product.stock === 0 ? (
                    <motion.span
                      key="out-of-stock"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Out of Stock
                    </motion.span>
                  ) : justAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </motion.span>
                      Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        className="inline-flex"
                        initial={false}
                        whileHover={{ rotate: [0, -12, 10, -6, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </motion.span>
                      {inCart ? 'Add Another' : 'Add to Cart'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile: Compact cart button — always visible, bottom-right (unchanged) */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="lg:hidden absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-card active:scale-90 transition-transform"
              style={{
                background: product.stock === 0
                  ? '#8FB3D4'
                  : inCart
                  ? '#22c55e'
                  : 'linear-gradient(135deg, #0D3B6E 0%, #1565C0 100%)',
              }}
              aria-label={inCart ? 'In Cart' : 'Add to Cart'}
            >
              {inCart ? (
                <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-2.5 sm:p-4">
            {/* Category */}
            <p className="text-[9px] sm:text-xs text-gray uppercase tracking-wider mb-0.5 sm:mb-1">
              {product.category?.name || 'Skincare'}
            </p>

            {/* Name */}
            <h3 className="font-semibold text-dark group-hover:text-coral transition-colors line-clamp-1 text-xs sm:text-sm">
              {product.name}
            </h3>

            {/* Rating — hide on smallest screens to save space */}
            <div className="hidden sm:flex items-center gap-1 mt-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-secondary-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray">({product.reviews_count})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="font-bold text-dark text-xs sm:text-sm">
                {formatPrice(product.discount_price || product.price)}
              </span>
              {product.discount_price && (
                <span className="text-gray line-through text-[10px] sm:text-xs">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
