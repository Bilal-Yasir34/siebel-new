import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Coupon, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  recalculateTotals: () => {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  getItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

export const SHIPPING_THRESHOLD = 1500;
const SHIPPING_COST = 200;

// Pure calculation — takes the *new* items/coupon directly as arguments
// rather than reading them back out of the store. Calling get() inside a
// set() updater (or inside a plain object passed to set()) returns the
// state as it was *before* this update is applied, which was causing
// totals to always lag one action behind (and made discounts compute
// against the previous, often-null, coupon).
function computeTotals(items: CartItem[], coupon: Coupon | null) {
  const subtotal = items.reduce((acc, item) => {
    const price = item.product.discount_price || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount);
      }
    } else {
      discount = coupon.discount_value;
    }
  }

  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = afterDiscount + shipping;

  return { subtotal, discount, shipping, total };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [...state.items, { product, quantity }];
          }

          return {
            items: newItems,
            coupon: state.coupon,
            ...computeTotals(newItems, state.coupon),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.product.id !== productId
          );
          return {
            items: newItems,
            coupon: state.coupon,
            ...computeTotals(newItems, state.coupon),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newItems =
            quantity <= 0
              ? state.items.filter((item) => item.product.id !== productId)
              : state.items.map((item) =>
                  item.product.id === productId ? { ...item, quantity } : item
                );

          return {
            items: newItems,
            coupon: state.coupon,
            ...computeTotals(newItems, state.coupon),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          coupon: null,
          subtotal: 0,
          discount: 0,
          shipping: 0,
          total: 0,
        });
      },

      applyCoupon: (coupon) => {
        set((state) => ({
          coupon,
          ...computeTotals(state.items, coupon),
        }));
      },

      removeCoupon: () => {
        set((state) => ({
          coupon: null,
          ...computeTotals(state.items, null),
        }));
      },

      recalculateTotals: () => {
        const state = get();
        return computeTotals(state.items, state.coupon);
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      isInCart: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },
    }),
    {
      name: 'siebel-cart',
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
      onRehydrateStorage: () => (state) => {
        // Only items/coupon are persisted — subtotal/discount/shipping/total
        // must be recomputed once the persisted cart has been restored,
        // otherwise they stay at their initial value of 0.
        if (state) {
          const totals = state.recalculateTotals();
          useCartStore.setState(totals);
        }
      },
    }
  )
);
