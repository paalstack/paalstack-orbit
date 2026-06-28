/**
 * App-level Zustand store types.
 * Extend with your own global state shape.
 */

export type Theme = 'light' | 'dark' | 'system';

export type UserPreferences = {
  locale: string;
  timezone: string;
  density: 'comfortable' | 'compact' | 'spacious';
};

export type AppState = {
  /** Whether a global loading overlay is visible */
  isLoading: boolean;
  /** Global notification message (null when no message) */
  notification: string | null;
  /** Active color scheme */
  theme: Theme;
  /** Whether the navigation sidebar is open */
  sidebarOpen: boolean;
  /** Persisted user preferences */
  userPreferences: UserPreferences;
};

export type AppActions = {
  setLoading: (isLoading: boolean) => void;
  showNotification: (message: string) => void;
  clearNotification: () => void;
  setTheme: (theme: Theme) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
  reset: () => void;
};

export type AppStore = AppState & AppActions;
