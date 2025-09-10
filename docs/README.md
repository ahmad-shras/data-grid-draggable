# ReusableAgGrid Component Documentation

## Table of Contents
- [Overview & Installation](#overview--installation)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Hooks Documentation](#hooks-documentation)
- [Customization Guide](#customization-guide)
- [TypeScript Support](#typescript-support)
- [Troubleshooting](#troubleshooting)

---

## Overview & Installation

### Description

The `ReusableAgGrid` component is a comprehensive, production-ready data grid built on top of AG Grid Community Edition. It provides advanced features including column persistence, visibility controls, responsive design, and extensive customization options while maintaining type safety throughout.

**Key Features:**
- 🔄 **Column Persistence** - Automatically saves and restores column order, visibility, and width
- 🎛️ **Visibility Controls** - Built-in UI for showing/hiding columns
- 📱 **Responsive Design** - Adapts to different screen sizes
- 🎨 **Theming Support** - Customizable themes and styling
- 📝 **TypeScript First** - Full type safety and IntelliSense support
- ⚡ **Performance** - Optimized for large datasets with virtualization

### Installation

```bash
# Install AG Grid dependencies
npm install ag-grid-community ag-grid-react

# Install peer dependencies (if not already installed)
npm install react react-dom
```

### CSS Imports

Add these imports to your main CSS file or component:

```css
/* In your index.css or main stylesheet */
@import 'ag-grid-community/styles/ag-grid.css';
@import 'ag-grid-community/styles/ag-theme-alpine.css';
```

### Quick Start

```tsx
import React from 'react';
import { ReusableAgGrid } from './components/ReusableAgGrid';
import type { GridColumn } from './components/ReusableAgGrid/types';

interface CarData {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
}

const MyGridExample = () => {
  const data: CarData[] = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2024, price: 28450 },
    { id: 2, make: 'Ford', model: 'F-150', year: 2024, price: 39900 },
    // ... more data
  ];

  const columns: GridColumn<CarData>[] = [
    { field: 'make', headerName: 'Make', colId: 'make' },
    { field: 'model', headerName: 'Model', colId: 'model' },
    { field: 'year', headerName: 'Year', colId: 'year' },
    { field: 'price', headerName: 'Price', colId: 'price' }
  ];

  return (
    <ReusableAgGrid
      data={data}
      columns={columns}
      height={500}
    />
  );
};
```

---

## API Reference

### ReusableAgGridProps<T>

#### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data objects to display in the grid |
| `columns` | `GridColumn<T>[]` | Column definitions with field mappings and configuration |

#### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `GridConfig` | `{}` | Grid configuration options |
| `className` | `string` | `'ag-theme-alpine'` | CSS class for AG Grid theme |
| `style` | `React.CSSProperties` | `undefined` | Inline styles for grid container |
| `height` | `number` | `500` | Grid height in pixels |
| `width` | `string` | `'100%'` | Grid width (CSS value) |

#### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onGridReady` | `(params: any) => void` | Fired when grid is initialized |
| `onColumnMoved` | `(params: any) => void` | Fired when column is moved |
| `onColumnVisible` | `(params: any) => void` | Fired when column visibility changes |
| `onColumnResized` | `(params: any) => void` | Fired when column is resized |
| `onRowClicked` | `(params: any) => void` | Fired when row is clicked |
| `onRowSelected` | `(params: any) => void` | Fired when row selection changes |
| `onCellClicked` | `(params: any) => void` | Fired when cell is clicked |

### GridColumn<T> Interface

```typescript
interface GridColumn<T = any> extends Omit<ColDef<T>, 'field'> {
  field: keyof T;           // Required: Field name from data object
  headerName: string;       // Required: Display name for column header
  colId: string;           // Required: Unique identifier for persistence
  sortable?: boolean;      // Optional: Enable/disable sorting
  hide?: boolean;          // Optional: Initially hide column
  width?: number;          // Optional: Column width in pixels
  pinned?: 'left' | 'right' | null; // Optional: Pin column position
  // ... extends all AG Grid ColDef properties
}
```

### GridConfig Interface

```typescript
interface GridConfig {
  enableColumnVisibilityControls?: boolean;  // Default: true
  enableSidebar?: boolean;                   // Default: true
  enableColumnPersistence?: boolean;         // Default: true
  storageKey?: string;                      // Default: 'agGrid'
  suppressMovableColumns?: boolean;          // Default: false
  animateRows?: boolean;                    // Default: true
  defaultColDef?: ColDef;                   // Default column properties
  pagination?: boolean;                     // Default: false
  paginationPageSize?: number;              // Default: 10
  rowSelection?: 'single' | 'multiple';    // Default: 'single'
}
```

---

## Usage Examples

### Basic Implementation

```tsx
import React from 'react';
import { ReusableAgGrid } from './components/ReusableAgGrid';

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  startDate: string;
}

const EmployeeGrid = () => {
  const employees: Employee[] = [
    { id: 1, name: 'John Doe', department: 'Engineering', salary: 85000, startDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 72000, startDate: '2022-11-20' },
  ];

  const columns = [
    { field: 'name', headerName: 'Employee Name', colId: 'name', width: 200 },
    { field: 'department', headerName: 'Department', colId: 'department', width: 150 },
    { 
      field: 'salary', 
      headerName: 'Salary', 
      colId: 'salary', 
      width: 120,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`
    },
    { 
      field: 'startDate', 
      headerName: 'Start Date', 
      colId: 'startDate', 
      width: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    }
  ];

  return (
    <ReusableAgGrid
      data={employees}
      columns={columns}
      height={400}
    />
  );
};
```

### Advanced Configuration

```tsx
const AdvancedGrid = () => {
  const config = {
    enableColumnPersistence: true,
    storageKey: 'employee-grid',
    pagination: true,
    paginationPageSize: 25,
    rowSelection: 'multiple',
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true
    }
  };

  const handleRowSelected = (params) => {
    console.log('Selected rows:', params.api.getSelectedRows());
  };

  return (
    <ReusableAgGrid
      data={employees}
      columns={columns}
      config={config}
      onRowSelected={handleRowSelected}
      height={600}
      className="ag-theme-alpine-dark"
    />
  );
};
```

### Custom Cell Renderers

```tsx
const columns = [
  {
    field: 'status',
    headerName: 'Status',
    colId: 'status',
    cellRenderer: (params) => {
      const statusColors = {
        active: '#4caf50',
        inactive: '#f44336',
        pending: '#ff9800'
      };
      
      return (
        <span 
          style={{ 
            color: statusColors[params.value],
            fontWeight: 'bold'
          }}
        >
          {params.value.toUpperCase()}
        </span>
      );
    }
  },
  {
    field: 'actions',
    headerName: 'Actions',
    colId: 'actions',
    cellRenderer: (params) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => editRow(params.data)}>Edit</button>
        <button onClick={() => deleteRow(params.data)}>Delete</button>
      </div>
    ),
    sortable: false,
    filter: false
  }
];
```

### Responsive Configuration

```tsx
const ResponsiveGrid = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mobileColumns = columns.filter(col => 
    ['name', 'department', 'actions'].includes(col.colId)
  );

  return (
    <ReusableAgGrid
      data={employees}
      columns={isMobile ? mobileColumns : columns}
      config={{
        enableSidebar: !isMobile,
        enableColumnVisibilityControls: !isMobile
      }}
      height={isMobile ? 400 : 600}
    />
  );
};
```

---

## Hooks Documentation

### useColumnPersistence

Custom hook that manages column state persistence in localStorage.

#### Parameters

```typescript
interface UseColumnPersistenceProps<T> {
  defaultColumns: GridColumn<T>[];  // Initial column configuration
  storageKey: string;               // Key for localStorage
  enabled: boolean;                 // Enable/disable persistence
}
```

#### Return Value

```typescript
interface UseColumnPersistenceReturn<T> {
  columns: GridColumn<T>[];                           // Current column state
  columnVisibility: { [key: string]: boolean };      // Column visibility map
  isLoaded: boolean;                                  // Loading state
  saveState: (api: any) => void;                     // Save current state
  applyState: (api: any) => void;                    // Apply saved state
  resetState: () => void;                            // Reset to defaults
  toggleColumnVisibility: (colId: string) => void;   // Toggle column visibility
}
```

#### Usage Example

```tsx
import { useColumnPersistence } from './hooks/useColumnPersistence';

const CustomGrid = () => {
  const {
    columns,
    columnVisibility,
    isLoaded,
    saveState,
    toggleColumnVisibility
  } = useColumnPersistence({
    defaultColumns: initialColumns,
    storageKey: 'my-grid',
    enabled: true
  });

  if (!isLoaded) {
    return <div>Loading grid configuration...</div>;
  }

  return (
    <div>
      <div>
        {Object.entries(columnVisibility).map(([colId, visible]) => (
          <label key={colId}>
            <input
              type="checkbox"
              checked={visible}
              onChange={() => toggleColumnVisibility(colId)}
            />
            {columns.find(col => col.colId === colId)?.headerName}
          </label>
        ))}
      </div>
      
      <AgGridReact
        columnDefs={columns}
        // ... other props
      />
    </div>
  );
};
```

---

## Customization Guide

### Theming

#### Built-in Themes

```tsx
// Alpine (default)
<ReusableAgGrid className="ag-theme-alpine" />

// Alpine Dark
<ReusableAgGrid className="ag-theme-alpine-dark" />

// Material Design
<ReusableAgGrid className="ag-theme-material" />

// Balham
<ReusableAgGrid className="ag-theme-balham" />
```

#### Custom Theme Variables

```css
/* Custom theme overrides */
.ag-theme-alpine {
  --ag-header-height: 48px;
  --ag-header-foreground-color: #333;
  --ag-header-background-color: #f8f9fa;
  --ag-odd-row-background-color: #fcfdfe;
  --ag-row-hover-color: #e3f2fd;
  --ag-selected-row-background-color: #bbdefb;
}

.ag-theme-custom {
  --ag-font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --ag-font-size: 14px;
  --ag-border-radius: 8px;
  --ag-borders: solid 1px #e0e0e0;
}
```

#### Runtime Theme Switching

```tsx
const ThemeableGrid = () => {
  const [theme, setTheme] = useState('ag-theme-alpine');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="ag-theme-alpine">Alpine</option>
        <option value="ag-theme-alpine-dark">Alpine Dark</option>
        <option value="ag-theme-material">Material</option>
      </select>
      
      <ReusableAgGrid
        data={data}
        columns={columns}
        className={theme}
      />
    </div>
  );
};
```

### Performance Optimization

#### Large Dataset Configuration

```tsx
const config = {
  // Enable virtualization for large datasets
  suppressRowVirtualisation: false,
  suppressColumnVirtualisation: false,
  
  // Pagination for better performance
  pagination: true,
  paginationPageSize: 100,
  
  // Reduce DOM updates
  suppressAnimationFrame: false,
  
  // Optimize column sizing
  defaultColDef: {
    resizable: true,
    sortable: true,
    suppressSizeToFit: true
  }
};
```

#### Memory Management

```tsx
const OptimizedGrid = () => {
  // Memoize column definitions
  const columns = useMemo(() => [
    { field: 'id', headerName: 'ID', colId: 'id' },
    { field: 'name', headerName: 'Name', colId: 'name' }
  ], []);

  // Memoize data processing
  const processedData = useMemo(() => 
    rawData.map(item => ({
      ...item,
      computed: item.value1 + item.value2
    })), [rawData]
  );

  return (
    <ReusableAgGrid
      data={processedData}
      columns={columns}
      config={optimizedConfig}
    />
  );
};
```

---

## TypeScript Support

### Generic Type Usage

```typescript
// Define your data interface
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

// Type-safe column definitions
const columns: GridColumn<Product>[] = [
  {
    field: 'name',        // ✅ TypeScript validates this exists on Product
    headerName: 'Product Name',
    colId: 'name',
    cellRenderer: (params: { value: string }) => (
      <strong>{params.value}</strong>
    )
  },
  {
    field: 'price',
    headerName: 'Price',
    colId: 'price',
    valueFormatter: (params: { value: number }) => 
      `$${params.value.toFixed(2)}`  // ✅ TypeScript knows value is number
  }
];

// Type-safe component usage
const ProductGrid = () => {
  const products: Product[] = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, inStock: true }
  ];

  return (
    <ReusableAgGrid<Product>
      data={products}
      columns={columns}
      onRowClicked={(params) => {
        // ✅ params.data is typed as Product
        console.log(params.data.name);
      }}
    />
  );
};
```

### Custom Cell Renderer Types

```typescript
import { ICellRendererParams } from 'ag-grid-community';

interface StatusCellProps extends ICellRendererParams {
  value: 'active' | 'inactive' | 'pending';
  data: Product;
}

const StatusCellRenderer: React.FC<StatusCellProps> = ({ value, data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'inactive': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#666';
    }
  };

  return (
    <span style={{ color: getStatusColor(value), fontWeight: 'bold' }}>
      {value.toUpperCase()}
    </span>
  );
};

// Usage in column definition
const columns: GridColumn<Product>[] = [
  {
    field: 'status',
    headerName: 'Status',
    colId: 'status',
    cellRenderer: StatusCellRenderer
  }
];
```

### Extending Interfaces

```typescript
// Extend the base GridConfig for your specific use case
interface CustomGridConfig extends GridConfig {
  enableExport?: boolean;
  customToolbar?: boolean;
  allowBulkEdit?: boolean;
}

// Extend column interface for additional metadata
interface CustomGridColumn<T> extends GridColumn<T> {
  tooltip?: string;
  validation?: (value: any) => boolean;
  category?: string;
}

// Create typed wrapper component
interface CustomGridProps<T> extends Omit<ReusableAgGridProps<T>, 'config' | 'columns'> {
  config?: CustomGridConfig;
  columns: CustomGridColumn<T>[];
}

const CustomGrid = <T,>(props: CustomGridProps<T>) => {
  // Custom logic here
  return <ReusableAgGrid {...props} />;
};
```

---

## Troubleshooting

### Common Issues

#### 1. Columns Not Persisting

**Problem:** Column order/visibility resets on page refresh.

**Solution:**
```typescript
// Ensure unique colId for each column
const columns = [
  { field: 'name', headerName: 'Name', colId: 'unique-name-col' },
  { field: 'email', headerName: 'Email', colId: 'unique-email-col' }
];

// Check localStorage permissions
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (error) {
  console.error('localStorage not available');
}
```

#### 2. Performance Issues with Large Datasets

**Problem:** Grid becomes slow with many rows.

**Solution:**
```typescript
const config = {
  // Enable pagination
  pagination: true,
  paginationPageSize: 50,
  
  // Enable virtualization
  suppressRowVirtualisation: false,
  
  // Optimize rendering
  suppressAnimationFrame: false,
  
  // Reduce DOM operations
  suppressColumnVirtualisation: false
};
```

#### 3. TypeScript Errors

**Problem:** Field type mismatches.

**Solution:**
```typescript
// Ensure field types match your data interface
interface User {
  id: number;
  name: string;
  age: number;
}

const columns: GridColumn<User>[] = [
  { field: 'id', headerName: 'ID', colId: 'id' },      // ✅ Correct
  { field: 'name', headerName: 'Name', colId: 'name' }, // ✅ Correct
  // { field: 'invalid', ... }                          // ❌ Would cause error
];
```

#### 4. CSS Styling Issues

**Problem:** Grid appears unstyled or broken.

**Solution:**
```css
/* Ensure AG Grid CSS is imported */
@import 'ag-grid-community/styles/ag-grid.css';
@import 'ag-grid-community/styles/ag-theme-alpine.css';

/* Set explicit height */
.grid-container {
  height: 500px;
  width: 100%;
}
```

### Performance Considerations

#### Bundle Size Optimization

```typescript
// Import only needed AG Grid modules
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
```

#### Memory Leaks Prevention

```typescript
const GridWithCleanup = () => {
  const gridApiRef = useRef();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (gridApiRef.current) {
        gridApiRef.current.destroy();
      }
    };
  }, []);

  return <ReusableAgGrid /* props */ />;
};
```

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Grid Core | ✅ 80+ | ✅ 78+ | ✅ 14+ | ✅ 80+ |
| Persistence | ✅ 80+ | ✅ 78+ | ✅ 14+ | ✅ 80+ |
| Virtualization | ✅ 80+ | ✅ 78+ | ✅ 14+ | ✅ 80+ |

### Debug Mode

```typescript
const config = {
  debug: true,                    // Enable AG Grid debug mode
  suppressConsoleWarnings: false, // Show warnings
  enableBrowserTooltips: true     // Enable native tooltips
};

// Custom debug logging
const handleGridReady = (params) => {
  console.log('Grid API:', params.api);
  console.log('Column API:', params.columnApi);
  console.log('Grid Options:', params.api.gridOptionsWrapper.gridOptions);
};
```

---

## Migration Guide

### From Basic AG Grid

```typescript
// Before: Basic AG Grid
<AgGridReact
  rowData={data}
  columnDefs={columns}
  className="ag-theme-alpine"
/>

// After: ReusableAgGrid
<ReusableAgGrid
  data={data}
  columns={columns}
  className="ag-theme-alpine"
/>
```

### Version Updates

When updating AG Grid versions, check compatibility:

```bash
# Check current versions
npm list ag-grid-community ag-grid-react

# Update to latest compatible versions
npm update ag-grid-community ag-grid-react
```

---

## Examples Repository

For complete working examples, visit our examples repository:

```bash
git clone https://github.com/your-org/reusable-ag-grid-examples
cd reusable-ag-grid-examples
npm install
npm start
```

### Example Projects

1. **Basic CRUD Application** - Simple employee management
2. **E-commerce Dashboard** - Product catalog with filters
3. **Financial Data Grid** - Real-time stock prices
4. **Mobile-Responsive Grid** - Adaptive column layouts
5. **Custom Theme Showcase** - Multiple theme implementations

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/your-org/reusable-ag-grid
cd reusable-ag-grid
npm install
npm run dev
```

### Testing

```bash
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:coverage  # Generate coverage report
```

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@your-org.com
- 💬 Discord: [Join our community](https://discord.gg/your-server)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/reusable-ag-grid/issues)
- 📖 Docs: [Documentation Site](https://reusable-ag-grid.your-org.com)
