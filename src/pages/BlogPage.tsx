import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Calendar, User, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

export function BlogPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      setPosts(data || []);
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">Our Blog</h1>
          <p className="section-subtitle">
            Skincare tips, ingredient deep-dives, and routines from the Siebel team
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gray" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft py-20 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-secondary-300 mx-auto mb-3" />
            <h2 className="font-heading text-lg text-dark mb-2">No posts yet</h2>
            <p className="text-gray text-sm">
              We're working on our first articles. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card-hover transition-shadow"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-secondary-100">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary-300">
                        <BookOpen className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <span className="badge badge-primary text-[10px] mb-2">{post.category}</span>
                    )}
                    <h2 className="font-heading text-lg text-dark mb-2 group-hover:text-pink-DEFAULT transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray line-clamp-2 mb-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray">
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                      )}
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.published_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
