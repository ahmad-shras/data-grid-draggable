import type { GridColumn, GridConfig } from './types';

// Main exports
export { ReusableAgGrid as default } from './ReusableAgGrid';
export { ReusableAgGrid } from './ReusableAgGrid';

// Component exports
export { ColumnVisibilityControls } from './components/ColumnVisibilityControls';

// Hook exports
export { useColumnPersistence } from './hooks/useColumnPersistence';

// Type exports
export type {
  GridColumn,
  GridConfig,
  ReusableAgGridProps,
  ColumnState,
  StorageData
} from './types';

// Utility function exports (optional)
export const createGridColumn = <T>(
  field: keyof T,
  headerName: string,
  options?: Partial<GridColumn<T>>
): GridColumn<T> => ({
  field,
  headerName,
  colId: String(field),
  sortable: true,
  ...options
});

export const createGridConfig = (options?: Partial<GridConfig>): GridConfig => ({
  enableColumnVisibilityControls: true,
  enableSidebar: true,
  enableColumnPersistence: true,
  storageKey: 'agGrid',
  suppressMovableColumns: false,
  animateRows: true,
  ...options
});
