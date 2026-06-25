import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X, Tag } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Coupon } from '@/types';

interface CouponFormState {
  id?: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  min_order_value: string;
  max_discount_amount: string;
  usage_limit: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const todayStr = () => new Date().toISOString().slice(0, 10);
const oneYearFromNowStr = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

const emptyForm = (): CouponFormState => ({
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_value: '',
  max_discount_amount: '',
  usage_limit: '',
  start_date: todayStr(),
  end_date: oneYearFromNowStr(),
  is_active: true,
});

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<CouponFormState>(emptyForm());

  const fetchCoupons = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    setCoupons(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openAddModal = () => {
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setForm({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_value),
      min_order_value: coupon.min_order_value ? String(coupon.min_order_value) : '',
      max_discount_amount: coupon.max_discount_amount ? String(coupon.max_discount_amount) : '',
      usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : '',
      start_date: coupon.start_date.slice(0, 10),
      end_date: coupon.end_date.slice(0, 10),
      is_active: coupon.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.discount_value) {
      toast.error('Coupon code and discount value are required.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order_value: form.min_order_value ? parseFloat(form.min_order_value) : null,
        max_discount_amount: form.max_discount_amount ? parseFloat(form.max_discount_amount) : null,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit, 10) : null,
        start_date: form.start_date,
        end_date: form.end_date,
        is_active: form.is_active,
      };

      if (form.id) {
        const { error } = await supabase.from('coupons').update(payload).eq('id', form.id);
        if (error) throw error;
        toast.success('Coupon updated.');
      } else {
        const { error } = await supabase.from('coupons').insert(payload);
        if (error) throw error;
        toast.success('Coupon created.');
      }

      setIsModalOpen(false);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      toast.error('Could not save coupon. The code may already be in use.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Delete coupon "${coupon.code}"? It will stop working immediately.`)) return;

    const { error } = await supabase.from('coupons').delete().eq('id', coupon.id);
    if (error) {
      toast.error('Could not delete coupon.');
      return;
    }
    toast.success('Coupon deleted.');
    setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {isLoading ? (
          <div className="skeleton h-4 w-24" />
        ) : (
          <p className="text-gray">{coupons.length} coupons</p>
        )}
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-secondary-50 text-gray text-left">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Min. Order</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Valid Until</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <TableSkeleton rows={5} columns={7} />
            </tbody>
          </table>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft py-16 text-center">
          <Tag className="w-10 h-10 text-secondary-300 mx-auto mb-3" />
          <p className="text-gray">No coupons yet. Create one to offer discounts at checkout.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-secondary-50 text-gray text-left">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Min. Order</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Valid Until</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t border-secondary-100">
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-dark">{coupon.code}</span>
                    {coupon.description && (
                      <div className="text-xs text-gray">{coupon.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-dark">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : formatPrice(coupon.discount_value)}
                  </td>
                  <td className="px-4 py-3 text-gray">
                    {coupon.min_order_value ? formatPrice(coupon.min_order_value) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray">
                    {coupon.usage_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}
                  </td>
                  <td className="px-4 py-3 text-gray">{formatDate(coupon.end_date)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${coupon.is_active ? 'badge-success' : 'badge-error'}`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEditModal(coupon)} className="p-2 text-gray hover:text-primary-500">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(coupon)} className="p-2 text-gray hover:text-red-500">
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
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-dark">
                {form.id ? 'Edit Coupon' : 'Add Coupon'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Coupon Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. WELCOME10"
                  className="input font-mono"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. 10% off for new customers"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Discount Type *</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as 'percentage' | 'fixed' })}
                    className="input"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div>
                  <label className="label">
                    Discount Value * {form.discount_type === 'percentage' ? '(%)' : '(Rs.)'}
                  </label>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Min. Order Value (Rs.)</label>
                  <input
                    type="number"
                    value={form.min_order_value}
                    onChange={(e) => setForm({ ...form, min_order_value: e.target.value })}
                    className="input"
                  />
                </div>
                {form.discount_type === 'percentage' && (
                  <div>
                    <label className="label">Max Discount Cap (Rs.)</label>
                    <input
                      type="number"
                      value={form.max_discount_amount}
                      onChange={(e) => setForm({ ...form, max_discount_amount: e.target.value })}
                      className="input"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Valid From</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Valid Until</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Usage Limit (optional)</label>
                <input
                  type="number"
                  value={form.usage_limit}
                  onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                  placeholder="Leave blank for unlimited"
                  className="input"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-dark">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                Active (customers can use this code)
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary flex-1">
                {isSaving ? 'Saving...' : form.id ? 'Update Coupon' : 'Add Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
