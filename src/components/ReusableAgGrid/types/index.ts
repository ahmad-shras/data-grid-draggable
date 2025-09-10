import type { ColDef } from 'ag-grid-community';

export interface GridColumn<T = any> extends Omit<ColDef<T>, 'field'> {
  field: keyof T;
  headerName: string;
  colId: string;
  sortable?: boolean;
  hide?: boolean;
  width?: number;
  pinned?: 'left' | 'right' | null;
}

export interface GridConfig {
  enableColumnVisibilityControls?: boolean;
  enableSidebar?: boolean;
  enableColumnPersistence?: boolean;
  storageKey?: string;
  suppressMovableColumns?: boolean;
  animateRows?: boolean;
  defaultColDef?: ColDef;
  pagination?: boolean;
  paginationPageSize?: number;
  rowSelection?: 'single' | 'multiple';
  [key: string]: any; // Allow additional AG-Grid properties
}

export interface ReusableAgGridProps<T> {
  data: T[];
  columns: GridColumn<T>[];
  config?: GridConfig;
  onGridReady?: (params: any) => void;
  onColumnMoved?: (params: any) => void;
  onColumnVisible?: (params: any) => void;
  onColumnResized?: (params: any) => void;
  onRowClicked?: (params: any) => void;
  onRowSelected?: (params: any) => void;
  onCellClicked?: (params: any) => void;
  className?: string;
  style?: React.CSSProperties;
  height?: number;
  width?: string;
}

export interface ColumnState {
  colId: string;
  hide: boolean;
  width: number;
  pinned: string | null;
  sort: string | null;
  sortIndex: number | null;
}

export interface StorageData<T> {
  columns: GridColumn<T>[];
  visibility: { [key: string]: boolean };
  timestamp: number;
}
