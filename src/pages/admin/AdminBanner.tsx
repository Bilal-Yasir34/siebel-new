import { useEffect, useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, Eye, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SkeletonBox } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import type { PromoBanner } from '@/types';

export function AdminBanner() {
  const [banner, setBanner] = useState<PromoBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchBanner = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('promo_banner')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setBanner(data || null);
    setLinkUrl(data?.link_url || '');
    setIsActive(data?.is_active ?? true);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const file = files[0];
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from('promo-banners')
        .upload(path, file);

      if (error) {
        toast.error(`Failed to upload image: ${error.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('promo-banners')
        .getPublicUrl(path);

      const payload = {
        image_url: publicUrlData.publicUrl,
        link_url: linkUrl || null,
        is_active: isActive,
      };

      if (banner) {
        const { error: updateError } = await supabase
          .from('promo_banner')
          .update(payload)
          .eq('id', banner.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('promo_banner')
          .insert(payload);
        if (insertError) throw insertError;
      }

      toast.success('Banner image updated.');
      fetchBanner();
    } catch (error) {
      console.error(error);
      toast.error('Could not upload banner image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!banner) {
      toast.error('Upload a banner image first.');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('promo_banner')
        .update({ link_url: linkUrl || null, is_active: isActive })
        .eq('id', banner.id);
      if (error) throw error;
      toast.success('Banner settings saved.');
      fetchBanner();
    } catch (error) {
      console.error(error);
      toast.error('Could not save banner settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveBanner = async () => {
    if (!banner) return;
    if (!confirm('Remove the popup banner? It will no longer show to customers.')) return;

    const { error } = await supabase.from('promo_banner').delete().eq('id', banner.id);
    if (error) {
      toast.error('Could not remove banner.');
      return;
    }
    toast.success('Banner removed.');
    setBanner(null);
    setLinkUrl('');
    setIsActive(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <SkeletonBox className="h-5 w-64 mb-6" />
        <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
          <SkeletonBox className="aspect-[16/9] rounded-xl" />
          <SkeletonBox className="h-10 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <p className="text-gray mb-6">
        This banner pops up in the center of the screen when a customer opens the site. It can
        be closed manually, or it disappears on its own after 5 seconds.
      </p>

      <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
        <div>
          <label className="label">Banner Image</label>
          {banner?.image_url ? (
            <div className="relative rounded-xl overflow-hidden border border-secondary-200 mb-3">
              <img src={banner.image_url} alt="Promo banner" className="w-full h-auto" />
            </div>
          ) : (
            <div className="aspect-[16/9] rounded-xl border-2 border-dashed border-secondary-300 flex flex-col items-center justify-center text-gray mb-3">
              <ImageIcon className="w-10 h-10 mb-2" />
              <p className="text-sm">No banner uploaded yet</p>
            </div>
          )}

          <div className="flex gap-3">
            <label className="btn-secondary flex items-center gap-2 cursor-pointer">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {banner ? 'Replace Image' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </label>

            {banner && (
              <button
                onClick={() => setPreviewOpen(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="label">Link URL (optional)</label>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="e.g. /products?category=sunblock"
            className="input"
          />
          <p className="text-xs text-gray mt-1">
            If set, clicking the banner takes customers to this page.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-dark">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Show banner to customers
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving || !banner}
            className="btn-primary flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          {banner && (
            <button onClick={handleRemoveBanner} className="btn-secondary text-red-500">
              Remove Banner
            </button>
          )}
        </div>
      </div>

      {previewOpen && banner && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewOpen(false)}
              aria-label="Close preview"
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white shadow-elevated flex items-center justify-center text-dark hover:text-primary-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={banner.image_url}
              alt="Banner preview"
              className="w-full h-auto rounded-2xl shadow-elevated"
            />
          </div>
        </div>
      )}
    </div>
  );
}
