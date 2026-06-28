/**
 * Re-export the Zustand app store hook for convenient imports.
 *
 * Usage:
 *   import { useAppStore } from '@/hooks/useAppStore';
 *   const { isLoading, setLoading } = useAppStore();
 */

export { useAppStore } from '@/stores/app';
