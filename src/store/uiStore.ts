import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isScrolled: boolean;
  searchQuery: string;

  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setScrolled: (scrolled: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      isSearchOpen: false,
      isCartOpen: false,
      isScrolled: false,
      searchQuery: '',

      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      setScrolled: (scrolled) => set({ isScrolled: scrolled }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'siebel-ui',
    }
  )
);
