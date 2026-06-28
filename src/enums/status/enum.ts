/**
 * Application-wide status enums.
 * Add your own domain enums following this pattern.
 */

export enum ItemStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum LoadingState {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}
