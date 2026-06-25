import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatPrice, slugify } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Product, Category } from '@/types';

interface ProductFormState {
  id?: string;
  name: string;
  short_description: string;
  description: string;
  ingredients: string;
  how_to_use: string;
  price: string;
  discount_price: string;
  stock: string;
  category_id: string;
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  images: string[];
}

const emptyForm: ProductFormState = {
  name: '',
  short_description: '',
  description: '',
  ingredients: '',
  how_to_use: '',
  price: '',
  discount_price: '',
  stock: '',
  category_id: '',
  featured: false,
  best_seller: false,
  new_arrival: false,
  images: [],
};

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState<ProductFormState>(emptyForm);

  const fetchData = async () => {
    setIsLoading(true);
    const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
      supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('display_order'),
    ]);

    setProducts(productsData || []);
    setCategories(categoriesData || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      short_description: product.short_description || '',
      description: product.description || '',
      ingredients: product.ingredients || '',
      how_to_use: product.how_to_use || '',
      price: String(product.price),
      discount_price: product.discount_price ? String(product.discount_price) : '',
      stock: String(product.stock),
      category_id: product.category_id || '',
      featured: product.featured,
      best_seller: product.best_seller,
      new_arrival: product.new_arrival,
      images: product.images || [],
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(path, file);

        if (error) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(path);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error('Name, price, and category are required.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: slugify(form.name),
        short_description: form.short_description || null,
        description: form.description || null,
        ingredients: form.ingredients || null,
        how_to_use: form.how_to_use || null,
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        stock: parseInt(form.stock, 10) || 0,
        category_id: form.category_id,
        featured: form.featured,
        best_seller: form.best_seller,
        new_arrival: form.new_arrival,
        images: form.images,
        is_active: true,
      };

      if (form.id) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', form.id);
        if (error) throw error;
        toast.success('Product updated.');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast.success('Product added.');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Could not save product. Please check the details and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) {
      toast.error('Could not delete product.');
      return;
    }
    toast.success('Product deleted.');
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {isLoading ? (
          <div className="skeleton h-4 w-24" />
        ) : (
          <p className="text-gray">{products.length} products</p>
        )}
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-secondary-50 text-gray text-left">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Sections</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <TableSkeleton rows={6} columns={6} />
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-secondary-50 text-gray text-left">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Sections</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-secondary-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary-100 overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray m-3" />
                        )}
                      </div>
                      <span className="font-medium text-dark">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray">{product.category?.name || '—'}</td>
                  <td className="px-4 py-3">
                    {product.discount_price ? (
                      <span>
                        <span className="text-dark font-medium">{formatPrice(product.discount_price)}</span>{' '}
                        <span className="text-gray line-through text-xs">{formatPrice(product.price)}</span>
                      </span>
                    ) : (
                      <span className="text-dark font-medium">{formatPrice(product.price)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {product.featured && <span className="badge badge-primary text-[10px]">Featured</span>}
                      {product.best_seller && <span className="badge badge-success text-[10px]">Best Seller</span>}
                      {product.new_arrival && <span className="badge badge-primary text-[10px]">New</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEditModal(product)} className="p-2 text-gray hover:text-primary-500">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product)} className="p-2 text-gray hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-dark">
                {form.id ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Short Description</label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input min-h-[100px]"
                />
              </div>

              <div>
                <label className="label">Ingredients</label>
                <textarea
                  value={form.ingredients}
                  onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  placeholder="List the ingredients shown on the product's Ingredients tab"
                  className="input min-h-[100px]"
                />
              </div>

              <div>
                <label className="label">How to Use</label>
                <textarea
                  value={form.how_to_use}
                  onChange={(e) => setForm({ ...form, how_to_use: e.target.value })}
                  placeholder="Usage instructions shown on the product's How to Use tab"
                  className="input min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Price (Rs.) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Sale Price (Rs.)</label>
                  <input
                    type="number"
                    value={form.discount_price}
                    onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Stock *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Category *</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="input"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Show on Homepage Sections</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-dark">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-dark">
                    <input
                      type="checkbox"
                      checked={form.best_seller}
                      onChange={(e) => setForm({ ...form, best_seller: e.target.checked })}
                    />
                    Best Sellers
                  </label>
                  <label className="flex items-center gap-2 text-sm text-dark">
                    <input
                      type="checkbox"
                      checked={form.new_arrival}
                      onChange={(e) => setForm({ ...form, new_arrival: e.target.checked })}
                    />
                    New Arrivals
                  </label>
                </div>
              </div>

              <div>
                <label className="label">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {form.images.map((url) => (
                    <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-secondary-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-secondary-300 flex items-center justify-center cursor-pointer text-gray hover:border-primary-500 hover:text-primary-500">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary flex-1">
                {isSaving ? 'Saving...' : form.id ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
