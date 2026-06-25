import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Grid3X3,
  List,
  Star,
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton, SkeletonBox } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import { debounce } from '@/lib/utils';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-1000', label: 'Under Rs. 1,000' },
  { value: '1000-2000', label: 'Rs. 1,000 - 2,000' },
  { value: '2000-3500', label: 'Rs. 2,000 - 3,500' },
  { value: '3500-', label: 'Above Rs. 3,500' },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const categorySlug = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || '';
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
  const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('is_active', true);

        // Category filter
        if (categorySlug) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();

          if (categoryData) {
            query = query.eq('category_id', categoryData.id);
          }
        }

        // Search filter
        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
        }

        // Special filters
        if (filter === 'new') {
          query = query.eq('new_arrival', true);
        } else if (filter === 'best-sellers') {
          query = query.eq('best_seller', true);
        }

        // fetch
        const { data } = await query;
        setProducts(data || []);

        // Fetch categories
        const { data: catsData } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order');
        setCategories(catsData || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, searchQuery, filter]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter((p) => {
        const price = p.discount_price || p.price;
        if (max) {
          return price >= min && price <= max;
        }
        return price >= min;
      });
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'best-selling':
        filtered.sort((a, b) => b.reviews_count - a.reviews_count);
        break;
      case 'price-low':
        filtered.sort(
          (a, b) => (a.discount_price || a.price) - (b.discount_price || b.price)
        );
        break;
      case 'price-high':
        filtered.sort(
          (a, b) => (b.discount_price || b.price) - (a.discount_price || a.price)
        );
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [products, priceRange, minRating, sortBy]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleSearch = debounce((value: string) => {
    updateFilters('q', value);
  }, 300);

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setPriceRange('all');
    setMinRating(0);
    setSortBy('featured');
  };

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const hasActiveFilters = categorySlug || searchQuery || filter || priceRange !== 'all' || minRating > 0;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {loading ? (
              <>
                <SkeletonBox className="h-7 w-48 mb-2" />
                <SkeletonBox className="h-4 w-24" />
              </>
            ) : (
              <>
                <h1 className="font-heading text-heading-1 text-dark">
                  {activeCategory?.name || filter === 'new' ? 'New Arrivals' : filter === 'best-sellers' ? 'Best Sellers' : 'All Products'}
                </h1>
                <p className="text-gray mt-2">
                  {filteredProducts.length} products
                  {activeCategory && ` in ${activeCategory.name}`}
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full lg:w-48 px-4 py-3 pr-10 bg-white rounded-xl border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} lg:hidden`}
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </button>

          {/* View Mode Toggle */}
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-pink-DEFAULT text-coral-dark'
                  : 'bg-white text-gray hover:bg-secondary-100'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-pink-DEFAULT text-coral-dark'
                  : 'bg-white text-gray hover:bg-secondary-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg font-medium">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray hover:text-dark"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-dark mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilters('category', '')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !categorySlug
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-gray hover:bg-secondary-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {loading ? (
                    <div className="space-y-2 px-3">
                      {[...Array(5)].map((_, i) => (
                        <SkeletonBox key={i} className="h-4 w-3/4" />
                      ))}
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateFilters('category', cat.slug)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          categorySlug === cat.slug
                            ? 'bg-primary-100 text-primary-600'
                            : 'text-gray hover:bg-secondary-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-dark mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setPriceRange(range.value)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        priceRange === range.value
                          ? 'bg-primary-100 text-primary-600'
                          : 'text-gray hover:bg-secondary-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-dark mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors ${
                        minRating === rating
                          ? 'bg-primary-100 text-primary-600'
                          : 'text-gray hover:bg-secondary-100'
                      }`}
                    >
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-secondary-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">& Up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white max-h-full overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-lg font-medium">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Same filter content as desktop */}
                  <div className="mb-6">
                    <h4 className="font-medium text-dark mb-3">Categories</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          updateFilters('category', '');
                          setShowFilters(false);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          !categorySlug
                            ? 'bg-pink-100 text-pink-DEFAULT'
                            : 'text-gray hover:bg-secondary-100'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            updateFilters('category', cat.slug);
                            setShowFilters(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            categorySlug === cat.slug
                              ? 'bg-pink-100 text-pink-DEFAULT'
                              : 'text-gray hover:bg-secondary-100'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {categorySlug && activeCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                    {activeCategory.name}
                    <button onClick={() => updateFilters('category', '')}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                    "{searchQuery}"
                    <button onClick={() => updateFilters('q', '')}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray text-lg">
                  No products found matching your criteria.
                </p>
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
