# Troubleshooting & Best Practices

## Common Issues and Solutions

### 1. Column Persistence Issues

#### Problem: Columns reset to default order on page refresh

**Symptoms:**
- Column order doesn't persist across browser sessions
- Column visibility settings are lost
- Width changes are not saved

**Solutions:**

```typescript
// ✅ Ensure unique colId for each column
const columns: GridColumn<T>[] = [
  { field: 'name', headerName: 'Name', colId: 'unique-name-id' },
  { field: 'email', headerName: 'Email', colId: 'unique-email-id' }
];

// ✅ Check localStorage availability
const checkLocalStorage = () => {
  try {
    const testKey = 'localStorage-test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage not available:', error);
    return false;
  }
};

// ✅ Use different storage keys for different grids
<ReusableAgGrid
  config={{ 
    enableColumnPersistence: true,
    storageKey: 'user-management-grid' // Unique per grid
  }}
/>
```

#### Problem: Storage quota exceeded

**Solution:**

```typescript
// Storage cleanup utility
const cleanOldGridData = (maxAge: number = 30) => {
  const now = Date.now();
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.includes('_agGrid_data')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.timestamp && (now - data.timestamp) > maxAge * 24 * 60 * 60 * 1000) {
          localStorage.removeItem(key);
          console.log(`Cleaned old grid data: ${key}`);
        }
      } catch (error) {
        // Remove corrupted data
        localStorage.removeItem(key);
      }
    }
  });
};

// Call on app initialization
useEffect(() => {
  cleanOldGridData(30); // Clean data older than 30 days
}, []);
```

### 2. Performance Issues

#### Problem: Grid becomes slow with large datasets

**Symptoms:**
- Scrolling lag
- Slow rendering
- Browser becomes unresponsive

**Solutions:**

```typescript
// ✅ Enable virtualization
const config = {
  suppressRowVirtualisation: false,
  suppressColumnVirtualisation: false,
  
  // ✅ Use pagination for very large datasets
  pagination: true,
  paginationPageSize: 100,
  
  // ✅ Optimize row height
  rowHeight: 35, // Smaller rows = better performance
  
  // ✅ Debounce resize operations
  suppressAnimationFrame: false
};

// ✅ Memoize column definitions
const columns = useMemo(() => [
  { field: 'id', headerName: 'ID', colId: 'id' }
  // ... other columns
], []); // Empty dependency array

// ✅ Optimize data processing
const processedData = useMemo(() => 
  rawData.map(item => ({
    ...item,
    // Pre-compute expensive operations
    computedField: expensiveCalculation(item)
  })), [rawData]
);
```

#### Problem: Memory leaks

**Solution:**

```typescript
// ✅ Proper cleanup in useEffect
const GridWithCleanup = () => {
  const gridApiRef = useRef<any>();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (gridApiRef.current) {
        gridApiRef.current.destroy?.();
      }
    };
  }, []);

  const handleGridReady = (params: any) => {
    gridApiRef.current = params.api;
  };

  return (
    <ReusableAgGrid
      data={data}
      columns={columns}
      onGridReady={handleGridReady}
    />
  );
};
```

### 3. TypeScript Errors

#### Problem: Field type mismatches

**Error:**
```
Type '"invalidField"' is not assignable to type 'keyof MyInterface'
```

**Solution:**

```typescript
// ✅ Ensure field names match interface
interface User {
  id: number;
  name: string;
  email: string;
}

const columns: GridColumn<User>[] = [
  { field: 'id', headerName: 'ID', colId: 'id' },      // ✅ Valid
  { field: 'name', headerName: 'Name', colId: 'name' }, // ✅ Valid
  // { field: 'invalidField', ... }                     // ❌ TypeScript error
];

// ✅ Use type assertion for computed fields
const computedColumn = {
  headerName: 'Full Name',
  colId: 'fullName',
  valueGetter: (params: any) => `${params.data.firstName} ${params.data.lastName}`
} as GridColumn<User>;
```

#### Problem: Cell renderer parameter types

**Solution:**

```typescript
// ✅ Properly typed cell renderer
interface CellRendererProps {
  value: any;
  data: User;
}

const TypedCellRenderer: React.FC<CellRendererProps> = ({ value, data }) => (
  <span>{value}</span>
);

// ✅ Use in column definition
const column: GridColumn<User> = {
  field: 'status',
  headerName: 'Status',
  colId: 'status',
  cellRenderer: TypedCellRenderer
};
```

### 4. Styling Issues

#### Problem: Grid appears unstyled

**Symptoms:**
- No borders or proper spacing
- Headers look broken
- Rows are not aligned

**Solution:**

```css
/* ✅ Ensure AG Grid CSS is imported first */
@import 'ag-grid-community/styles/ag-grid.css';
@import 'ag-grid-community/styles/ag-theme-alpine.css';

/* ✅ Set explicit container height */
.grid-container {
  height: 500px; /* Must have explicit height */
  width: 100%;
}

/* ✅ Override theme variables if needed */
.ag-theme-alpine {
  --ag-header-height: 48px;
  --ag-row-height: 40px;
  --ag-font-family: inherit;
}
```

#### Problem: Custom cell renderer styling conflicts

**Solution:**

```typescript
// ✅ Use CSS-in-JS for component isolation
const StyledCellRenderer = ({ value }: any) => (
  <div
    style={{
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: '#f5f5f5',
      // Avoid using CSS classes that might conflict
    }}
  >
    {value}
  </div>
);

// ✅ Or use CSS modules
import styles from './CellRenderer.module.css';

const CSSModuleCellRenderer = ({ value }: any) => (
  <div className={styles.cellRenderer}>
    {value}
  </div>
);
```

### 5. Event Handling Issues

#### Problem: Event handlers not firing

**Solution:**

```typescript
// ✅ Ensure proper event binding
const MyGrid = () => {
  // ✅ Use useCallback to prevent unnecessary re-renders
  const handleRowClick = useCallback((params: any) => {
    console.log('Row clicked:', params.data);
  }, []);

  const handleCellClick = useCallback((params: any) => {
    console.log('Cell clicked:', params.value);
  }, []);

  return (
    <ReusableAgGrid
      data={data}
      columns={columns}
      onRowClicked={handleRowClick}
      onCellClicked={handleCellClick}
    />
  );
};
```

## Best Practices

### 1. Data Management

```typescript
// ✅ Normalize data structure
interface NormalizedData<T> {
  items: T[];
  byId: Record<string | number, T>;
  loading: boolean;
  error: string | null;
}

const useNormalizedData = <T extends { id: string | number }>(
  fetchFn: () => Promise<T[]>
) => {
  const [state, setState] = useState<NormalizedData<T>>({
    items: [],
    byId: {},
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchFn()
      .then(items => {
        const byId = items.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {} as Record<string | number, T>);

        setState({
          items,
          byId,
          loading: false,
          error: null
        });
      })
      .catch(error => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      });
  }, []);

  return state;
};
```

### 2. Column Management

```typescript
// ✅ Centralized column configuration
const createColumnConfig = <T>() => {
  const baseColumns: Partial<GridColumn<T>> = {
    resizable: true,
    sortable: false, // Disable by default, enable per column
    width: 150,
    minWidth: 100
  };

  const createColumn = (
    field: keyof T,
    headerName: string,
    overrides?: Partial<GridColumn<T>>
  ): GridColumn<T> => ({
    ...baseColumns,
    field,
    headerName,
    colId: String(field),
    ...overrides
  });

  return { createColumn, baseColumns };
};

// Usage
const { createColumn } = createColumnConfig<User>();

const columns = [
  createColumn('name', 'Full Name', { width: 200, sortable: true }),
  createColumn('email', 'Email Address', { width: 250 }),
  createColumn('status', 'Status', { width: 100 })
];
```

### 3. Error Boundaries

```typescript
// ✅ Grid error boundary
interface GridErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class GridErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  GridErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): GridErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Grid error:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Something went wrong with the grid</h3>
          <p>Please refresh the page or contact support</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
const SafeGrid = () => (
  <GridErrorBoundary>
    <ReusableAgGrid data={data} columns={columns} />
  </GridErrorBoundary>
);
```

### 4. Testing Strategies

```typescript
// ✅ Grid testing utilities
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const createMockGridApi = () => ({
  getSelectedRows: jest.fn(() => []),
  selectAll: jest.fn(),
  deselectAll: jest.fn(),
  getColumnState: jest.fn(() => []),
  applyColumnState: jest.fn(),
  setRowData: jest.fn()
});

const renderGrid = (props: Partial<ReusableAgGridProps<any>> = {}) => {
  const defaultProps = {
    data: [],
    columns: [],
    ...props
  };

  return render(<ReusableAgGrid {...defaultProps} />);
};

// Test example
describe('ReusableAgGrid', () => {
  it('renders data correctly', () => {
    const testData = [
      { id: 1, name: 'John Doe', email: 'john@example.com' }
    ];

    const columns = [
      { field: 'name', headerName: 'Name', colId: 'name' },
      { field: 'email', headerName: 'Email', colId: 'email' }
    ];

    renderGrid({ data: testData, columns });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles row selection', async () => {
    const user = userEvent.setup();
    const onRowSelected = jest.fn();

    renderGrid({
      data: testData,
      columns: testColumns,
      config: { rowSelection: 'single' },
      onRowSelected
    });

    const firstRow = screen.getByText('John Doe').closest('.ag-row');
    await user.click(firstRow);

    expect(onRowSelected).toHaveBeenCalled();
  });
});
```

### 5. Accessibility

```typescript
// ✅ Accessibility best practices
const accessibleColumns = [
  {
    field: 'name',
    headerName: 'Full Name',
    colId: 'name',
    // Add ARIA labels for screen readers
    headerTooltip: 'Employee full name',
    cellRenderer: (params: any) => (
      <span
        role="gridcell"
        aria-label={`Full name: ${params.value}`}
      >
        {params.value}
      </span>
    )
  }
];

const AccessibleGrid = () => (
  <div role="region" aria-label="Employee data grid">
    <ReusableAgGrid
      data={data}
      columns={accessibleColumns}
      config={{
        // Enable keyboard navigation
        suppressRowClickSelection: false,
        // Announce changes to screen readers
        enableRangeSelection: true
      }}
    />
  </div>
);
```

## Performance Optimization

### 1. Bundle Size Optimization

```typescript
// ✅ Import only needed AG Grid modules
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';

// Register only required modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// ✅ Lazy load large datasets
const useLazyData = <T>(fetchFn: (page: number, size: number) => Promise<T[]>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPage = useCallback(async (page: number, size: number) => {
    setLoading(true);
    try {
      const newData = await fetchFn(page, size);
      setData(prev => [...prev, ...newData]);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  return { data, loading, loadPage };
};
```

### 2. Rendering Optimization

```typescript
// ✅ Optimize cell renderers
const OptimizedCellRenderer = React.memo(({ value }: any) => (
  <span>{value}</span>
));

// ✅ Use React.memo for grid wrapper
const MemoizedGrid = React.memo(<T,>(props: ReusableAgGridProps<T>) => (
  <ReusableAgGrid {...props} />
));

// ✅ Debounce expensive operations
import { debounce } from 'lodash';

const useDebounceSearch = (searchFn: (term: string) => void, delay: number = 300) => {
  return useMemo(
    () => debounce(searchFn, delay),
    [searchFn, delay]
  );
};
```

## Browser Compatibility

### Supported Browsers

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 80+ | Full support |
| Firefox | 78+ | Full support |
| Safari | 14+ | Full support |
| Edge | 80+ | Full support |
| IE | ❌ | Not supported |

### Polyfills

```typescript
// ✅ Add polyfills for older browsers
// In your main index.tsx or polyfills.ts
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// ResizeObserver polyfill for older browsers
if (!window.ResizeObserver) {
  import('resize-observer-polyfill').then(module => {
    window.ResizeObserver = module.default;
  });
}
```

## Security Considerations

### 1. XSS Prevention

```typescript
// ✅ Sanitize user input in cell renderers
import DOMPurify from 'dompurify';

const SafeHtmlRenderer = ({ value }: any) => (
  <div
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(value)
    }}
  />
);

// ✅ Validate data before rendering
const validateAndSanitizeData = <T>(data: any[]): T[] => {
  return data.map(item => {
    const sanitized = { ...item };
    
    // Sanitize string fields
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = DOMPurify.sanitize(sanitized[key]);
      }
    });
    
    return sanitized;
  });
};
```

### 2. Data Privacy

```typescript
// ✅ Implement data masking for sensitive fields
const createMaskedColumn = <T>(
  field: keyof T,
  headerName: string,
  maskPattern: string = '***'
): GridColumn<T> => ({
  field,
  headerName,
  colId: String(field),
  cellRenderer: (params: any) => {
    // Only show full value to authorized users
    const canViewSensitive = checkUserPermissions();
    return canViewSensitive ? params.value : maskPattern;
  }
});

// Usage for sensitive data
const sensitiveColumns = [
  createMaskedColumn<User>('ssn', 'SSN', '***-**-****'),
  createMaskedColumn<User>('salary', 'Salary', '$****')
];
```

This comprehensive troubleshooting guide should help resolve most common issues and provide best practices for optimal implementation of the ReusableAgGrid component.
