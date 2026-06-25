import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Quote, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton, CategoryGridSkeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';

// Inline SVG icons for the "Why Choose Siebel" section — hardcoded markup so
// they always render, with no dependency on an external icon library.
type IconProps = { className?: string };

function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 20c8 0 14-6 14-15-9 0-15 6-15 14 0 .5 0 1 .1 1.5" />
      <path d="M5 20c0-4 2-8 6-11" />
    </svg>
  );
}

function FlaskIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4.8 18a1.8 1.8 0 0 0 1.55 2.7h11.3A1.8 1.8 0 0 0 19.2 18L14 9.5V3" />
      <path d="M7.5 16h9" />
    </svg>
  );
}

function HeartHandIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 7.5C10.8 5.7 9 5 7.5 5 5.5 5 4 6.6 4 8.6c0 3 3 5.1 8 9.4 5-4.3 8-6.4 8-9.4C20 6.6 18.5 5 16.5 5 15 5 13.2 5.7 12 7.5Z" />
    </svg>
  );
}

function RecycleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m7 19-3-5 3-5" />
      <path d="M4 14h7.5" />
      <path d="m13 4 3 5h-7.5" />
      <path d="M19.5 9 17 4" />
      <path d="m17 19 3-5h-7" />
      <path d="M9.5 14 12 19" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3 4.5 5.5v6c0 5 3.5 7.8 7.5 9.5 4-1.7 7.5-4.5 7.5-9.5v-6Z" />
      <path d="m9 12 2.3 2.3L15.5 10" />
    </svg>
  );
}

function GemIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5.5 8 3 4h18l-2.5 4" />
      <path d="M3 4l9 17 9-17" />
      <path d="M8.5 4 12 11l3.5-7" />
    </svg>
  );
}

const heroSlides = [
  {
    title: 'Reveal Your Natural Glow',
    subtitle: 'Premium Skincare Collection',
    description: 'Discover our luxurious range of skincare products crafted with the finest ingredients for radiant, healthy-looking skin.',
    image: '/images/bannerimage1.jpg',
    cta: 'Shop Now',
    link: '/products',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Spring 2025 Collection',
    description: 'Introducing our latest innovations in skincare science. Experience the future of beauty.',
    image: '/images/bannerimage2.jpg',
    cta: 'Explore New',
    link: '/products?filter=new',
  },
  {
    title: 'Best Sellers',
    subtitle: 'Customer Favorites',
    description: 'Join thousands of happy customers who have transformed their skin with our most loved products.',
    image: '/images/bannerimage3.jpg',
    cta: 'Shop Best Sellers',
    link: '/products?filter=best-sellers',
  },
];

const whyChooseItems = [
  {
    icon: LeafIcon,
    title: 'Natural Ingredients',
    description: 'We use only the highest quality natural ingredients sourced from around the world.',
  },
  {
    icon: FlaskIcon,
    title: 'Science-Backed Formulas',
    description: 'Every product is developed with dermatologists and backed by clinical research.',
  },
  {
    icon: HeartHandIcon,
    title: 'Cruelty-Free',
    description: 'We never test on animals. All our products are certified cruelty-free.',
  },
  {
    icon: RecycleIcon,
    title: 'Sustainable Packaging',
    description: "Committed to eco-friendly packaging that's recyclable and sustainable.",
  },
  {
    icon: ShieldCheckIcon,
    title: 'Dermatologist Approved',
    description: 'All products are tested and approved by board-certified dermatologists.',
  },
  {
    icon: GemIcon,
    title: 'Premium Quality',
    description: 'Luxurious formulations that deliver visible results you can see and feel.',
  },
];

const testimonials = [
  {
    name: 'Mustafa Sethi',
    role: 'Verified Buyer',
    content: 'Siebel has completely transformed my skincare routine. The Vitamin C Serum is absolutely incredible!',
    rating: 5,
    image: '/images/user.png',
  },
  {
    name: 'Natasha Rehman',
    role: 'Verified Buyer',
    content: 'I have been using the RapiWhite Cream for 3 months and my skin has never looked better. So gentle yet effective!',
    rating: 5,
    image: '/images/user.png',
  },
  {
    name: 'Maryam',
    role: 'Verified Buyer',
    content: 'The Sebum Control Sunblock is worth every penny. Fits so perfectly with my oily skin!',
    rating: 5,
    image: '/images/user.png',
  },
];

const instagramPosts = [
  '/images/instagram-1.jpg',
  '/images/instagram-2.jpg',
  '/images/instagram-3.jpg',
  '/images/instagram-4.jpg',
  '/images/instagram-5.jpg',
  '/images/instagram-6.jpg',
];

// Product Slider Component
function ProductSlider({
  products,
  title,
  subtitle,
  isLoading,
}: {
  products: Product[];
  title: string;
  subtitle: string;
  isLoading?: boolean;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </motion.div>

        {isLoading ? (
          <>
            {/* Mobile Grid - 2 columns */}
            <div className="lg:hidden">
              <ProductGridSkeleton count={6} className="grid-cols-2" />
            </div>
            {/* Desktop Slider */}
            <div className="hidden lg:flex gap-6 overflow-x-auto hide-scrollbar pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px]">
                  <ProductGridSkeleton count={1} className="grid-cols-1" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="relative">
            {/* Desktop Navigation */}
            <button
              onClick={() => scroll('left')}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-elevated items-center justify-center hover:bg-pink-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-dark" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-elevated items-center justify-center hover:bg-pink-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-dark" />
            </button>

            {/* Mobile Grid - 2 columns */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
              {products.slice(0, 6).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Desktop Slider */}
            <div
              ref={sliderRef}
              className="hidden lg:flex gap-6 overflow-x-auto hide-scrollbar pb-4"
            >
              {products.map((product, index) => (
                <div key={product.id} className="flex-shrink-0 w-[280px]">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: featured } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('featured', true)
          .eq('is_active', true)
          .limit(10);

        const { data: bestSellersData } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('best_seller', true)
          .eq('is_active', true)
          .limit(10);

        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        const shopByCategoryOrder = [
          'Whitening Cream',
          'Face Wash',
          'Serum',
          'Sunblock',
          'Body Lotion',
        ];
        const filteredCategories = (categoriesData || [])
          .filter((cat) => shopByCategoryOrder.includes(cat.name))
          .sort(
            (a, b) =>
              shopByCategoryOrder.indexOf(a.name) - shopByCategoryOrder.indexOf(b.name)
          );

        setFeaturedProducts(featured || []);
        setBestSellers(bestSellersData || []);
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
          >
            <div className="absolute inset-0">
              <img src={slide.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>

            <div className="relative h-full container-custom flex items-center">
              <div className="max-w-2xl text-white">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                  transition={{ delay: 0.2 }}
                  className="text-pink-200 font-medium mb-4 tracking-wider uppercase"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                  transition={{ delay: 0.3 }}
                  className="font-heading text-display-2 md:text-display-1 mb-6"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                  transition={{ delay: 0.4 }}
                  className="text-body-lg text-white/90 mb-8"
                >
                  {slide.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to={slide.link} className="btn-primary btn-lg">
                    {slide.cta} <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Slider Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-light flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-light flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Featured Products Slider */}
      <ProductSlider
        products={featuredProducts}
        title="Featured Products"
        subtitle="Handpicked selections from our premium skincare collection"
        isLoading={isLoading}
      />

      {/* Categories */}
      <section className="section-padding bg-gradient-to-b from-pink-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find the perfect products for your skincare routine</p>
          </motion.div>

          {isLoading ? (
            <CategoryGridSkeleton count={5} className="grid-cols-2 md:grid-cols-3 lg:grid-cols-5" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/products?category=${category.slug}`} className="group block">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-pink-100 mb-3">
                      <img
                        src={category.image_url || '/placeholder-category.jpg'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-medium text-dark text-center group-hover:text-pink-DEFAULT transition-colors text-sm sm:text-base">
                      {category.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Slider */}
      <ProductSlider
        products={bestSellers}
        title="Best Sellers"
        subtitle="Discover what our customers love the most"
        isLoading={isLoading}
      />

      {/* Why Choose Siebel */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Why Choose Siebel</h2>
            <p className="section-subtitle">We're committed to delivering premium skincare you can trust</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-pink-DEFAULT" />
                </div>
                <h3 className="font-heading text-heading-4 text-dark mb-2">{item.title}</h3>
                <p className="text-gray text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner - Free Shipping */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/promo-banner.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-dark/95 to-purple-DEFAULT/90" />
        </div>
        <div className="relative container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-display-2 mb-4">
              Free Shipping on Orders Over Rs. 1,500
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Enjoy free delivery anywhere in Pakistan. Premium skincare delivered to your doorstep.
            </p>
            <Link to="/products" className="btn bg-white text-dark font-semibold hover:bg-pink-50 btn-lg">
              Start Shopping <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-b from-pink-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real customers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8"
              >
                <Quote className="w-10 h-10 text-blue-500 mb-4" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-dark mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-dark">{testimonial.name}</p>
                    <p className="text-sm text-gray">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Follow Us on Instagram</h2>
            <p className="section-subtitle">
              <a href="https://www.instagram.com/siebel.skincare/" target="_blank" rel="noopener noreferrer" className="text-pink-DEFAULT hover:text-pink-dark">
                @siebel.skincare
              </a>
            </p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {instagramPosts.map((post, index) => (
              <motion.a
                key={index}
                href="https://www.instagram.com/siebel.skincare/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square rounded-lg overflow-hidden group relative"
              >
                <img src={post} alt="Instagram post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-pink-DEFAULT/0 group-hover:bg-pink-DEFAULT/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="section-padding bg-gradient-to-b from-pink-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Real Results</h2>
            <p className="section-subtitle">See the transformation our customers have experienced</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Brighter Skin in 4 Weeks', product: 'Radiance Brightening Cream', image: '/images/results-1.jpg' },
              { title: 'Clearer Complexion', product: 'Clarifying Acne Treatment', image: '/images/results-2.jpg' },
              { title: 'Hydrated & Glowing', product: 'Hyaluronic Acid Serum', image: '/images/results-3.jpg' },
            ].map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-card">
                  <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-heading text-lg text-dark mb-1">{result.title}</h3>
                <p className="text-sm text-gray">{result.product}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
