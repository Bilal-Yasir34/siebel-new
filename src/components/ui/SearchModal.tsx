import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useUIStore } from '@/store';
import { supabase } from '@/lib/supabase';
import { SkeletonBox } from '@/components/ui/Skeleton';
import type { Product } from '@/types';
import { formatPrice, debounce } from '@/lib/utils';

export function SearchModal() {
  const navigate = useNavigate();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`)
        .eq('is_active', true)
        .limit(8);

      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(searchProducts, 300), [searchProducts]);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setResults([]);
    }
  }, [query, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleClose = () => {
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-elevated overflow-hidden"
          >
            {/* Search Input */}
            <form onSubmit={handleSubmit} className="p-4 border-b border-secondary-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-secondary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray hover:text-dark"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="p-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <SkeletonBox className="w-16 h-16 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <SkeletonBox className="h-4 w-2/3" />
                        <SkeletonBox className="h-3 w-1/2" />
                      </div>
                      <SkeletonBox className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="text-center py-12 text-gray">
                  <p>No products found for "{query}"</p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary-100 transition-colors"
                    >
                      <img
                        src={product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover bg-secondary-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark truncate">{product.name}</p>
                        <p className="text-sm text-gray truncate">
                          {product.short_description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-dark">
                          {formatPrice(product.discount_price || product.price)}
                        </p>
                        {product.discount_price && (
                          <p className="text-sm text-gray line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* View All Results */}
            {query && results.length > 0 && (
              <div className="p-4 border-t border-secondary-200">
                <button
                  onClick={handleSubmit}
                  className="w-full btn-secondary"
                >
                  View all results for "{query}"
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
