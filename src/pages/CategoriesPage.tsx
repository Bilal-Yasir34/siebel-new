import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { CategoryGridSkeleton } from '@/components/ui/Skeleton';
import type { Category } from '@/types';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      setCategories(data || []);
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">All Categories</h1>
          <p className="section-subtitle">
            Browse our full skincare range by category
          </p>
        </motion.div>

        {isLoading ? (
          <CategoryGridSkeleton count={8} className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/products?category=${category.slug}`} className="group block">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-pink-100 mb-3 shadow-soft">
                    <img
                      src={category.image_url || '/placeholder-category.jpg'}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium text-dark text-center group-hover:text-pink-DEFAULT transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-gray text-center mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
