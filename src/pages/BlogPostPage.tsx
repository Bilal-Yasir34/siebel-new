import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Calendar, User, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-heading-2 text-dark mb-2">Post not found</h1>
          <p className="text-gray mb-6">This blog post may have been moved or removed.</p>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container-custom max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray hover:text-pink-DEFAULT mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-soft overflow-hidden"
        >
          {post.featured_image && (
            <div className="aspect-[16/9] overflow-hidden">
              <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-10">
            {post.category && (
              <span className="badge badge-primary text-[10px] mb-3">{post.category}</span>
            )}
            <h1 className="font-heading text-heading-1 text-dark mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray mb-8 pb-6 border-b border-secondary-200">
              {post.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              )}
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
                </span>
              )}
            </div>

            {post.content ? (
              <div className="prose prose-sm sm:prose-base max-w-none text-dark whitespace-pre-line">
                {post.content}
              </div>
            ) : (
              <p className="text-gray">{post.excerpt}</p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-secondary-200">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary-100 text-gray px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </div>
  );
}
