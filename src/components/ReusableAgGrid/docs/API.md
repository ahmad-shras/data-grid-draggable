# API Reference

## Components

### ReusableAgGrid

Main grid component with all features included.

```typescript
interface ReusableAgGridProps<T> {
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
```

## Interfaces

### GridColumn<T>

Extended AG Grid column definition with additional properties.

```typescript
interface GridColumn<T = any> extends Omit<ColDef<T>, 'field'> {
  field: keyof T;           // Field name from data object
  headerName: string;       // Display name for column header
  colId: string;           // Unique identifier for persistence
  sortable?: boolean;      // Enable/disable sorting
  hide?: boolean;          // Initially hide column
  width?: number;          // Column width in pixels
  pinned?: 'left' | 'right' | null; // Pin column position
}
```

### GridConfig

Configuration object for grid behavior and features.

```typescript
interface GridConfig {
  enableColumnVisibilityControls?: boolean;       // Show/hide column controls
  columnVisibilityButtonVariant?: 'icon' | 'text' | 'both'; // Button display style
  columnVisibilityButtonPosition?: 'left' | 'right';        // Button alignment
  columnVisibilityButtonText?: string;             // Custom button text
  enableSidebar?: boolean;                        // Enable AG Grid sidebar
  enableColumnPersistence?: boolean;              // Save column state
  storageKey?: string;                           // LocalStorage key prefix
  suppressMovableColumns?: boolean;               // Disable column reordering
  animateRows?: boolean;                         // Enable row animations
  defaultColDef?: ColDef;                        // Default column properties
  pagination?: boolean;                          // Enable pagination
  paginationPageSize?: number;                   // Rows per page
  rowSelection?: 'single' | 'multiple';         // Row selection mode
  [key: string]: any;                           // Additional AG Grid props
}
```

#### Column Visibility Control Options

- **`columnVisibilityButtonVariant`**: Controls the button appearance
  - `'icon'`: Compact icon button with count badge
  - `'text'`: Text-only button with count display  
  - `'both'`: Icon + text combination (default)

- **`columnVisibilityButtonPosition`**: Controls button alignment in toolbar
  - `'left'`: Align to left side of toolbar (default)
  - `'right'`: Align to right side of toolbar

- **`columnVisibilityButtonText`**: Custom text for the button (default: "Columns")

## Methods

### Grid API Methods

Access via `onGridReady` callback:

```typescript
const handleGridReady = (params: any) => {
  const { api, columnApi } = params;
  
  // Row operations
  api.selectAll();                    // Select all rows
  api.deselectAll();                 // Deselect all rows
  api.getSelectedRows();             // Get selected row data
  
  // Column operations
  api.getColumnState();              // Get current column state
  api.applyColumnState(state);       // Apply column state
  api.resetColumnState();            // Reset to default state
  
  // Data operations
  api.setRowData(newData);          // Update grid data
  api.refreshCells();               // Refresh cell rendering
  
  // Export operations
  api.exportDataAsCsv();            // Export as CSV
  api.exportDataAsExcel();          // Export as Excel
};
```

## Events

### Grid Events

All event handlers receive AG Grid event parameters:

```typescript
interface GridEventParams {
  api: GridApi;           // Grid API instance
  columnApi: ColumnApi;   // Column API instance
  data?: any;            // Row data (for row events)
  node?: RowNode;        // Row node (for row events)
  value?: any;           // Cell value (for cell events)
  column?: Column;       // Column instance (for column events)
  event?: Event;         // Original DOM event
}
```

### Event Examples

```typescript
const MyGrid = () => {
  const handleRowClicked = (params: GridEventParams) => {
    console.log('Row clicked:', params.data);
  };

  const handleCellClicked = (params: GridEventParams) => {
    console.log('Cell clicked:', {
      value: params.value,
      field: params.column.getColId(),
      rowData: params.data
    });
  };

  const handleSelectionChanged = (params: GridEventParams) => {
    const selectedRows = params.api.getSelectedRows();
    console.log('Selection changed:', selectedRows);
  };

  return (
    <ReusableAgGrid
      data={data}
      columns={columns}
      onRowClicked={handleRowClicked}
      onCellClicked={handleCellClicked}
      onRowSelected={handleSelectionChanged}
    />
  );
};
```

## Utilities

### Column Helpers

Utility functions for creating common column types:

```typescript
// Currency column
const createCurrencyColumn = <T>(
  field: keyof T,
  headerName: string
): GridColumn<T> => ({
  field,
  headerName,
  colId: String(field),
  valueFormatter: (params) => `$${params.value.toLocaleString()}`,
  cellStyle: { textAlign: 'right' }
});

// Date column
const createDateColumn = <T>(
  field: keyof T,
  headerName: string
): GridColumn<T> => ({
  field,
  headerName,
  colId: String(field),
  valueFormatter: (params) => new Date(params.value).toLocaleDateString()
});

// Boolean column with icons
const createBooleanColumn = <T>(
  field: keyof T,
  headerName: string
): GridColumn<T> => ({
  field,
  headerName,
  colId: String(field),
  cellRenderer: (params) => params.value ? '✅ Yes' : '❌ No'
});
```

### Storage Utilities

```typescript
// Clear all grid storage
const clearGridStorage = (storageKey: string) => {
  const keys = Object.keys(localStorage).filter(key => 
    key.startsWith(`${storageKey}_agGrid`)
  );
  keys.forEach(key => localStorage.removeItem(key));
};

// Export grid state
const exportGridState = (api: GridApi, storageKey: string) => {
  const state = {
    columnState: api.getColumnState(),
    filterState: api.getFilterModel(),
    sortState: api.getSortModel()
  };
  return JSON.stringify(state);
};

// Import grid state
const importGridState = (api: GridApi, stateJson: string) => {
  try {
    const state = JSON.parse(stateJson);
    api.applyColumnState({ state: state.columnState, applyOrder: true });
    api.setFilterModel(state.filterState);
    api.setSortModel(state.sortState);
  } catch (error) {
    console.error('Failed to import grid state:', error);
  }
};
```

## Column Visibility Controls

### Overview

The new column visibility controls provide a modern popover interface for managing column visibility, replacing the previous inline list format. The controls feature a professional toolbar integration with multiple display options.

### Features

- **Popover Interface**: Clean, space-saving popover menu
- **Multiple Button Variants**: Icon-only, text-only, or combined display
- **Flexible Positioning**: Left or right alignment in toolbar
- **Visual Feedback**: Shows visible/total column count
- **Interactive Design**: Hover effects and smooth animations
- **Responsive**: Adapts to different screen sizes

### Configuration Examples

#### Icon Button (Compact)
```typescript
const config = {
  enableColumnVisibilityControls: true,
  columnVisibilityButtonVariant: 'icon',
  columnVisibilityButtonPosition: 'left'
};
```

#### Text Button (Custom Label)
```typescript
const config = {
  enableColumnVisibilityControls: true,
  columnVisibilityButtonVariant: 'text',
  columnVisibilityButtonPosition: 'right',
  columnVisibilityButtonText: 'Configure Columns'
};
```

#### Combined Button (Default)
```typescript
const config = {
  enableColumnVisibilityControls: true,
  columnVisibilityButtonVariant: 'both',
  columnVisibilityButtonPosition: 'left',
  columnVisibilityButtonText: 'Manage Columns'
};
```

### Styling Customization

The column visibility controls can be customized via the component props:

```typescript
import { ColumnVisibilityControls } from './components/ReusableAgGrid';

<ColumnVisibilityControls
  columns={columns}
  columnVisibility={columnVisibility}
  onToggleVisibility={handleToggle}
  variant="both"
  position="right"
  buttonText="Columns"
  buttonStyle={{ backgroundColor: '#f0f8ff' }}
  popoverStyle={{ minWidth: '250px' }}
  titleStyle={{ color: '#333' }}
/>
```

### Best Practices

1. **For compact layouts**: Use `variant: 'icon'` to save space
2. **For clarity**: Use `variant: 'both'` (default) to show all information
3. **For branding**: Use `variant: 'text'` with custom `buttonText`
4. **Mobile responsive**: Icon variant works best on smaller screens
5. **Accessibility**: All variants include proper ARIA labels and keyboard support
