import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, getErrorMessage } from '@/lib/supabase';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      isAdmin: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin',
          isLoading: false,
        });
      },

      fetchUser: async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();

          if (authUser) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .maybeSingle();

            if (profile) {
              set({
                user: profile as User,
                isAuthenticated: true,
                isAdmin: profile.role === 'admin',
                isLoading: false,
              });
            } else {
              // Auth account exists but no profile row yet (e.g. it failed to
              // create at signup time because email confirmation was
              // required). Create it now that we have an active session.
              const { data: newProfile } = await supabase
                .from('profiles')
                .insert({
                  id: authUser.id,
                  email: authUser.email,
                  first_name: authUser.user_metadata?.first_name ?? null,
                  last_name: authUser.user_metadata?.last_name ?? null,
                })
                .select()
                .single();

              set({
                user: (newProfile as User) ?? null,
                isAuthenticated: !!newProfile,
                isAdmin: newProfile?.role === 'admin',
                isLoading: false,
              });
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isAdmin: false,
              isLoading: false,
            });
          }
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        await get().fetchUser();
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          await get().fetchUser();
          return { error: null };
        } catch {
          set({ isLoading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      register: async (email, password, firstName, lastName) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          const authUser = data.user;

          if (!authUser) {
            set({ isLoading: false });
            return { error: 'Registration failed. Please try again.' };
          }

          // Create profile using the user returned from signUp (works whether
          // or not a session was issued immediately)
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              email,
              first_name: firstName,
              last_name: lastName,
            });

          if (profileError) {
            // Profile creation requires an active session (RLS). If email
            // confirmation is required, there is no session yet — the
            // profile row will be created on first login instead.
            console.warn('Profile not created at signup time:', profileError.message);
          }

          if (!data.session) {
            // Email confirmation is required before the user can log in
            set({ isLoading: false });
            return { error: null };
          }

          await get().fetchUser();
          return { error: null };
        } catch (err) {
          set({ isLoading: false });
          return { error: getErrorMessage(err) };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      },

      resetPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) return { error: error.message };
          return { error: null };
        } catch {
          return { error: 'An unexpected error occurred' };
        }
      },

      updatePassword: async (password) => {
        try {
          const { error } = await supabase.auth.updateUser({ password });
          if (error) return { error: error.message };
          return { error: null };
        } catch {
          return { error: 'An unexpected error occurred' };
        }
      },

      updateProfile: async (updates) => {
        try {
          const user = get().user;
          if (!user) return { error: 'Not authenticated' };

          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

          if (error) return { error: error.message };

          set({ user: { ...user, ...updates } });
          return { error: null };
        } catch {
          return { error: 'An unexpected error occurred' };
        }
      },
    }),
    {
      name: 'siebel-auth',
      partialize: () => ({
        // Only persist non-sensitive data
      }),
    }
  )
);
