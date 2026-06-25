import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Minus,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RefreshCw,
  Check,
  ThumbsUp,
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonBox, ProductGridSkeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabase';
import { useCartStore, useAuthStore } from '@/store';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { Product, Review } from '@/types';
import toast from 'react-hot-toast';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howToUse'>('description');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);


  const discount = product ? calculateDiscount(product.price, product.discount_price) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);

      try {
        const { data } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (data) {
          setProduct(data);

          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*, user:profiles(first_name, last_name)')
            .eq('product_id', data.id)
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(10);

          setReviews(reviewsData || []);

          if (data.category_id) {
            const { data: related } = await supabase
              .from('products')
              .select('*, category:categories(*)')
              .eq('category_id', data.category_id)
              .neq('id', data.id)
              .eq('is_active', true)
              .limit(4);

            setRelatedProducts(related || []);
          }

          // Fetch featured products for "You May Also Like"
          const { data: featured } = await supabase
            .from('products')
            .select('*, category:categories(*)')
            .eq('featured', true)
            .neq('id', data.id)
            .eq('is_active', true)
            .limit(4);

          setFeaturedProducts(featured || []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  const handleSubmitReview = async () => {
    if (!product || !user) return;

    if (reviewRating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          user_id: user.id,
          rating: reviewRating,
          title: reviewTitle || null,
          review: reviewText || null,
        })
        .select('*, user:profiles(first_name, last_name)')
        .single();

      if (error) throw error;

      setReviews((prev) => [data, ...prev]);
      setReviewRating(0);
      setReviewTitle('');
      setReviewText('');
      toast.success('Thank you for your review!');
    } catch (error) {
      console.error(error);
      toast.error('Could not submit your review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-pink-50 border-b border-pink-100">
          <div className="container-custom py-4">
            <SkeletonBox className="h-4 w-64" />
          </div>
        </div>
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image gallery skeleton */}
            <div>
              <SkeletonBox className="aspect-square rounded-2xl mb-4" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <SkeletonBox key={i} className="w-20 h-20 rounded-lg flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Info skeleton */}
            <div className="bg-pink-50 rounded-2xl p-8 space-y-4">
              <SkeletonBox className="h-3 w-24" />
              <SkeletonBox className="h-9 w-3/4" />
              <SkeletonBox className="h-5 w-40" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-5/6" />
              <SkeletonBox className="h-10 w-1/2 mt-2" />
              <SkeletonBox className="h-5 w-1/3" />
              <div className="flex gap-4 pt-2">
                <SkeletonBox className="h-14 w-32 rounded-xl" />
                <SkeletonBox className="h-14 flex-1 rounded-xl" />
              </div>
              <SkeletonBox className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="mt-12">
            <div className="flex gap-4 border-b border-pink-200 mb-6 pb-4">
              <SkeletonBox className="h-5 w-24" />
              <SkeletonBox className="h-5 w-24" />
              <SkeletonBox className="h-5 w-24" />
            </div>
            <SkeletonBox className="h-32 w-full rounded-2xl" />
          </div>

          {/* You may also like skeleton */}
          <div className="mt-12">
            <SkeletonBox className="h-7 w-56 mb-6" />
            <ProductGridSkeleton count={4} className="grid-cols-2 md:grid-cols-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="font-heading text-heading-1 text-dark mb-4">Product Not Found</h1>
        <p className="text-gray mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  const images = product.images || [];
  const displayProducts = relatedProducts.length > 0 ? relatedProducts : featuredProducts;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-pink-50 border-b border-pink-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray">
            <Link to="/" className="hover:text-pink-DEFAULT">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-pink-DEFAULT">Products</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link to={`/products?category=${product.category.slug}`} className="hover:text-pink-DEFAULT">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-dark">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-pink-50 mb-4 relative">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-light flex items-center justify-center hover:bg-white transition-colors shadow-soft"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-light flex items-center justify-center hover:bg-white transition-colors shadow-soft"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.new_arrival && (
                  <span className="badge text-coral-dark font-bold px-3 py-1 rounded-lg" style={{ background: 'linear-gradient(135deg, #B3CEDF 0%, #6B9EC5 100%)' }}>New</span>
                )}
                {discount && (
                  <span className="badge bg-purple-DEFAULT text-white px-3 py-1 rounded-lg">-{discount}%</span>
                )}
                {product.best_seller && (
                  <span className="badge bg-green-500 text-white px-3 py-1 rounded-lg">Best Seller</span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-pink-DEFAULT' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-pink-50 rounded-2xl p-8">
              <p className="text-sm text-gray uppercase tracking-wider mb-2">
                {product.category?.name || 'Skincare'}
              </p>

              <h1 className="font-heading text-heading-1 text-dark mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-secondary-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray">{product.rating.toFixed(1)} ({product.reviews_count} reviews)</span>
              </div>

              {product.short_description && (
                <p className="text-gray mb-6">{product.short_description}</p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="font-heading text-3xl text-dark">
                  {formatPrice(product.discount_price || product.price)}
                </span>
                {product.discount_price && (
                  <span className="text-xl text-gray line-through">{formatPrice(product.price)}</span>
                )}
                {discount && (
                  <span className="badge bg-green-100 text-green-700">Save {discount}%</span>
                )}
              </div>

              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" /> In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                <div className="flex items-center self-start border border-pink-200 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 sm:p-3 hover:bg-pink-100 transition-colors rounded-l-xl"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className="px-3 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base font-medium min-w-[40px] sm:min-w-[60px]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 sm:p-3 hover:bg-pink-100 transition-colors rounded-r-xl"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 animated-add-btn ${product.stock === 0 ? 'disabled' : ''}`}
                >
                  <span className="text">Add to Cart</span>
                  <span className="circle"></span>
                  <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                  <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full btn-outline btn-lg mb-8"
              >
                Buy Now
              </button>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-pink-200">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-pink-DEFAULT" />
                  <p className="text-sm text-gray">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-pink-DEFAULT" />
                  <p className="text-sm text-gray">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-6 h-6 mx-auto mb-2 text-pink-DEFAULT" />
                  <p className="text-sm text-gray">Easy Returns</p>
                </div>
              </div>
            </div>

            {product.sku && (
              <p className="text-sm text-gray mt-4 text-center">SKU: {product.sku}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-4 border-b border-pink-200 mb-6">
            {['description', 'ingredients', 'howToUse'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`pb-4 px-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-pink-DEFAULT border-b-2 border-pink-DEFAULT'
                    : 'text-gray hover:text-dark'
                }`}
              >
                {tab === 'howToUse' ? 'How to Use' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-pink-50 rounded-2xl p-8">
            {activeTab === 'description' && (
              <div className="prose prose-pink max-w-none">
                <p className="text-gray whitespace-pre-line">{product.description || product.short_description}</p>
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-heading text-lg font-medium text-dark mb-4">Benefits</h3>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-pink-DEFAULT flex-shrink-0 mt-0.5" />
                          <span className="text-gray">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'ingredients' && (
              <p className="text-gray whitespace-pre-line">{product.ingredients || 'Ingredients information not available.'}</p>
            )}
            {activeTab === 'howToUse' && (
              <p className="text-gray whitespace-pre-line">{product.how_to_use || 'Usage instructions not available.'}</p>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="font-heading text-heading-2 text-dark mb-6">Customer Reviews</h2>

          {/* Write a Review */}
          <div className="bg-secondary-50 rounded-2xl p-6 mb-6">
            <h3 className="font-medium text-dark mb-3">Write a Review</h3>
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHoverRating(star)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (reviewHoverRating || reviewRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-secondary-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Review title (optional)"
                  className="input"
                />
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="input min-h-[90px]"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="btn-primary"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-gray mb-3">Sign in to share your experience with this product.</p>
                <Link to="/login" className="btn-primary">Sign In to Review</Link>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="bg-pink-50 rounded-2xl p-8 text-center">
              <p className="text-gray">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-pink-50 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-secondary-300'}`} />
                        ))}
                      </div>
                      {review.title && <h4 className="font-medium text-dark">{review.title}</h4>}
                    </div>
                    {review.is_verified_purchase && (
                      <span className="badge bg-green-100 text-green-700 text-xs">
                        <Check className="w-3 h-3 mr-1" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-gray">{review.review}</p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray">
                      By {review.user?.first_name || 'Anonymous'} - {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <button className="flex items-center gap-1 text-sm text-gray hover:text-pink-DEFAULT">
                      <ThumbsUp className="w-4 h-4" />
                      {review.likes_count > 0 && <span>{review.likes_count}</span>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* You May Also Like */}
        {displayProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-heading-2 text-dark mb-6">
              {relatedProducts.length > 0 ? 'You May Also Like' : 'Featured Products'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {displayProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
