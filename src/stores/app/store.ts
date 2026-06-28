/**
 * App-level Zustand store.
 *
 * Provides global UI state (loading, notifications, theme, sidebar, preferences).
 * Theme and sidebar state are persisted to localStorage via the persist middleware.
 *
 * Usage:
 *   import { useAppStore } from '@/hooks/useAppStore';
 *   const { isLoading, setLoading, theme, setTheme } = useAppStore();
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { type AppStore, type Theme, type UserPreferences } from './type';

const DEFAULT_PREFERENCES: UserPreferences = {
  locale: 'en',
  timezone: 'UTC',
  density: 'comfortable',
};

const initialState = {
  isLoading: false,
  notification: null,
  theme: 'system' as Theme,
  sidebarOpen: true,
  userPreferences: DEFAULT_PREFERENCES,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

        showNotification: (message) => set({ notification: message }, false, 'showNotification'),

        clearNotification: () => set({ notification: null }, false, 'clearNotification'),

        setTheme: (theme) => set({ theme }, false, 'setTheme'),

        setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),

        setUserPreferences: (prefs) =>
          set(
            (state) => ({ userPreferences: { ...state.userPreferences, ...prefs } }),
            false,
            'setUserPreferences'
          ),

        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'paalstack-app-store',
        // Only persist UI preferences — skip transient state
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          userPreferences: state.userPreferences,
        }),
      }
    ),
    { name: 'AppStore' }
  )
);
