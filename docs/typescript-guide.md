# TypeScript Guide

## Type Safety with ReusableAgGrid

This guide covers advanced TypeScript usage patterns, generic types, and type-safe configuration for the ReusableAgGrid component.

## Table of Contents
- [Basic Type Usage](#basic-type-usage)
- [Generic Types](#generic-types)
- [Custom Cell Renderers](#custom-cell-renderers)
- [Event Type Safety](#event-type-safety)
- [Advanced Patterns](#advanced-patterns)
- [Type Utilities](#type-utilities)

## Basic Type Usage

### Data Interface Definition

```typescript
// Define your data structure
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: string;
  department: {
    id: number;
    name: string;
  };
}

// Type-safe column definitions
const columns: GridColumn<User>[] = [
  {
    field: 'firstName',    // ✅ TypeScript validates this exists on User
    headerName: 'First Name',
    colId: 'firstName',
    width: 150
  },
  {
    field: 'email',        // ✅ TypeScript validates field type
    headerName: 'Email',
    colId: 'email',
    width: 200,
    valueFormatter: (params: { value: string }) => params.value.toLowerCase()
  },
  {
    field: 'age',          // ✅ TypeScript knows this is a number
    headerName: 'Age',
    colId: 'age',
    width: 80,
    valueFormatter: (params: { value: number }) => `${params.value} years`
  }
];
```

### Component Usage with Types

```typescript
const UserGrid: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <ReusableAgGrid<User>
      data={users}
      columns={columns}
      onRowClicked={(params) => {
        // ✅ params.data is typed as User
        console.log(params.data.firstName);
        console.log(params.data.department.name);
      }}
    />
  );
};
```

## Generic Types

### Creating Reusable Column Factories

```typescript
// Generic column factory with type constraints
const createColumn = <T, K extends keyof T>(
  field: K,
  headerName: string,
  options?: Partial<GridColumn<T>>
): GridColumn<T> => ({
  field,
  headerName,
  colId: String(field),
  width: 150,
  ...options
});

// Usage with type inference
const userColumns = [
  createColumn<User, 'firstName'>('firstName', 'First Name', { width: 200 }),
  createColumn<User, 'email'>('email', 'Email Address', { width: 250 }),
  createColumn<User, 'age'>('age', 'Age', { width: 80 })
];
```

### Typed Column Helpers

```typescript
// Currency column with number constraint
const createCurrencyColumn = <T>(
  field: keyof T & string,
  headerName: string,
  currencySymbol: string = '$'
): GridColumn<T> => ({
  field,
  headerName,
  colId: field,
  width: 120,
  valueFormatter: (params: { value: number }) => 
    `${currencySymbol}${params.value.toLocaleString()}`,
  cellStyle: { textAlign: 'right' as const }
});

// Date column with string constraint
const createDateColumn = <T>(
  field: keyof T & string,
  headerName: string,
  format: 'short' | 'long' = 'short'
): GridColumn<T> => ({
  field,
  headerName,
  colId: field,
  width: 130,
  valueFormatter: (params: { value: string | Date }) => {
    const date = new Date(params.value);
    return format === 'short' 
      ? date.toLocaleDateString()
      : date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
  }
});

// Boolean column with custom labels
const createBooleanColumn = <T>(
  field: keyof T & string,
  headerName: string,
  labels: { true: string; false: string } = { true: 'Yes', false: 'No' }
): GridColumn<T> => ({
  field,
  headerName,
  colId: field,
  width: 100,
  cellRenderer: (params: { value: boolean }) => 
    params.value ? labels.true : labels.false
});
```

## Custom Cell Renderers

### Strongly Typed Cell Renderers

```typescript
import { ICellRendererParams } from 'ag-grid-community';

// Generic cell renderer interface
interface TypedCellRendererParams<T, V = any> extends ICellRendererParams {
  value: V;
  data: T;
}

// Status badge renderer with enum types
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

interface StatusBadgeProps extends TypedCellRendererParams<User, UserStatus> {}

const StatusBadgeRenderer: React.FC<StatusBadgeProps> = ({ value, data }) => {
  const statusConfig = {
    [UserStatus.ACTIVE]: { color: '#4caf50', label: 'Active' },
    [UserStatus.INACTIVE]: { color: '#9e9e9e', label: 'Inactive' },
    [UserStatus.PENDING]: { color: '#ff9800', label: 'Pending' },
    [UserStatus.SUSPENDED]: { color: '#f44336', label: 'Suspended' }
  };

  const config = statusConfig[value];

  return (
    <span
      style={{
        color: config.color,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '12px'
      }}
    >
      {config.label}
    </span>
  );
};

// Progress bar renderer with number validation
interface ProgressRendererProps extends TypedCellRendererParams<any, number> {}

const ProgressRenderer: React.FC<ProgressRendererProps> = ({ value }) => {
  // TypeScript ensures value is a number
  const percentage = Math.min(Math.max(value, 0), 100);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '100px',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: percentage > 70 ? '#4caf50' : percentage > 40 ? '#ff9800' : '#f44336',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      <span style={{ fontSize: '12px' }}>{percentage}%</span>
    </div>
  );
};
```

### Action Button Renderers

```typescript
// Action buttons with typed callbacks
interface ActionRendererProps<T> extends TypedCellRendererParams<T> {
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  onView?: (data: T) => void;
}

const ActionRenderer = <T,>({ 
  data, 
  onEdit, 
  onDelete, 
  onView 
}: ActionRendererProps<T>) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {onView && (
      <button
        onClick={() => onView(data)}
        style={{ fontSize: '12px', padding: '2px 6px' }}
      >
        View
      </button>
    )}
    {onEdit && (
      <button
        onClick={() => onEdit(data)}
        style={{ fontSize: '12px', padding: '2px 6px' }}
      >
        Edit
      </button>
    )}
    {onDelete && (
      <button
        onClick={() => onDelete(data)}
        style={{ fontSize: '12px', padding: '2px 6px', color: '#f44336' }}
      >
        Delete
      </button>
    )}
  </div>
);

// Usage with type safety
const createActionColumn = <T>(
  actions: {
    onEdit?: (data: T) => void;
    onDelete?: (data: T) => void;
    onView?: (data: T) => void;
  }
): GridColumn<T> => ({
  headerName: 'Actions',
  colId: 'actions',
  width: 150,
  cellRenderer: (params) => (
    <ActionRenderer
      {...params}
      {...actions}
    />
  ),
  sortable: false,
  pinned: 'right'
});
```

## Event Type Safety

### Typed Event Handlers

```typescript
// Custom event parameter types
interface GridEventParams<T> {
  api: any; // AG Grid API
  data: T;
  node: any;
  event?: Event;
}

interface CellEventParams<T, V = any> extends GridEventParams<T> {
  value: V;
  column: any;
  colDef: GridColumn<T>;
}

// Typed event handlers
const handleUserRowClick = (params: GridEventParams<User>) => {
  console.log('User clicked:', params.data.firstName);
  // TypeScript knows params.data is User type
};

const handleCellClick = (params: CellEventParams<User>) => {
  console.log('Cell value:', params.value);
  console.log('User data:', params.data);
  // Full type safety for both cell value and row data
};

// Grid component with typed events
const TypedUserGrid = () => {
  return (
    <ReusableAgGrid<User>
      data={users}
      columns={columns}
      onRowClicked={handleUserRowClick}
      onCellClicked={handleCellClick}
    />
  );
};
```

### Custom Hook with Types

```typescript
// Typed selection hook
const useGridSelection = <T>() => {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  const handleSelectionChange = useCallback((params: GridEventParams<T>) => {
    const selected = params.api.getSelectedRows() as T[];
    setSelectedRows(selected);
    setSelectedCount(selected.length);
  }, []);

  const clearSelection = useCallback((api: any) => {
    api.deselectAll();
    setSelectedRows([]);
    setSelectedCount(0);
  }, []);

  return {
    selectedRows,
    selectedCount,
    handleSelectionChange,
    clearSelection
  };
};

// Usage
const SelectableUserGrid = () => {
  const { selectedRows, selectedCount, handleSelectionChange } = useGridSelection<User>();

  return (
    <div>
      <p>Selected: {selectedCount} users</p>
      <ReusableAgGrid<User>
        data={users}
        columns={columns}
        config={{ rowSelection: 'multiple' }}
        onRowSelected={handleSelectionChange}
      />
    </div>
  );
};
```

## Advanced Patterns

### Conditional Column Rendering

```typescript
// Conditional columns based on user permissions
interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canViewSalary: boolean;
}

const createConditionalColumns = <T>(
  baseColumns: GridColumn<T>[],
  permissions: UserPermissions
): GridColumn<T>[] => {
  const columns = [...baseColumns];

  if (permissions.canViewSalary) {
    columns.push({
      field: 'salary' as keyof T,
      headerName: 'Salary',
      colId: 'salary',
      width: 120,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`
    });
  }

  if (permissions.canEdit || permissions.canDelete) {
    columns.push(createActionColumn({
      onEdit: permissions.canEdit ? handleEdit : undefined,
      onDelete: permissions.canDelete ? handleDelete : undefined
    }));
  }

  return columns;
};
```

### Computed Columns

```typescript
// Computed column type
interface ComputedColumn<T> {
  colId: string;
  headerName: string;
  compute: (data: T) => any;
  formatter?: (value: any) => string;
  width?: number;
}

const createComputedColumn = <T>(
  config: ComputedColumn<T>
): GridColumn<T> => ({
  headerName: config.headerName,
  colId: config.colId,
  width: config.width || 150,
  valueGetter: (params) => config.compute(params.data),
  valueFormatter: config.formatter ? 
    (params) => config.formatter!(params.value) : undefined,
  sortable: true
});

// Usage for computed fields
const userColumns = [
  ...baseColumns,
  createComputedColumn<User>({
    colId: 'fullName',
    headerName: 'Full Name',
    compute: (user) => `${user.firstName} ${user.lastName}`,
    width: 200
  }),
  createComputedColumn<User>({
    colId: 'accountAge',
    headerName: 'Account Age',
    compute: (user) => {
      const created = new Date(user.createdAt);
      const now = new Date();
      return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    },
    formatter: (days) => `${days} days`,
    width: 120
  })
];
```

## Type Utilities

### Column Type Helpers

```typescript
// Extract field types from data interface
type FieldType<T, K extends keyof T> = T[K];

// Create strongly typed value formatters
const createTypedFormatter = <T, K extends keyof T>(
  formatter: (value: FieldType<T, K>) => string
) => (params: { value: FieldType<T, K> }) => formatter(params.value);

// Number formatter
const numberFormatter = createTypedFormatter<User, 'age'>((age) => `${age} years old`);

// Date formatter
const dateFormatter = createTypedFormatter<User, 'createdAt'>((date) => 
  new Date(date).toLocaleDateString()
);

// Usage in columns
const typedColumns: GridColumn<User>[] = [
  {
    field: 'age',
    headerName: 'Age',
    colId: 'age',
    valueFormatter: numberFormatter
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    colId: 'createdAt',
    valueFormatter: dateFormatter
  }
];
```

### Grid Configuration Types

```typescript
// Extend grid config with custom options
interface CustomGridConfig<T> extends GridConfig {
  enableExport?: boolean;
  exportFileName?: string;
  customActions?: Array<{
    label: string;
    handler: (selectedRows: T[]) => void;
    icon?: string;
  }>;
}

// Typed grid wrapper
interface TypedGridProps<T> extends Omit<ReusableAgGridProps<T>, 'config'> {
  config?: CustomGridConfig<T>;
}

const TypedGrid = <T,>({ config, ...props }: TypedGridProps<T>) => {
  const handleExport = useCallback(() => {
    if (config?.enableExport) {
      // Export logic with type safety
    }
  }, [config]);

  return (
    <div>
      {config?.customActions && (
        <div style={{ marginBottom: '8px' }}>
          {config.customActions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.handler([])}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
      <ReusableAgGrid {...props} config={config} />
    </div>
  );
};
```

### Type Guards and Validation

```typescript
// Type guard for data validation
const isValidUser = (data: any): data is User => {
  return (
    typeof data === 'object' &&
    typeof data.id === 'number' &&
    typeof data.firstName === 'string' &&
    typeof data.lastName === 'string' &&
    typeof data.email === 'string' &&
    typeof data.age === 'number' &&
    typeof data.isActive === 'boolean' &&
    typeof data.createdAt === 'string'
  );
};

// Validated grid data hook
const useValidatedGridData = <T>(
  data: unknown[],
  validator: (item: unknown) => item is T
) => {
  return useMemo(() => {
    const validData = data.filter(validator);
    const invalidCount = data.length - validData.length;
    
    if (invalidCount > 0) {
      console.warn(`Found ${invalidCount} invalid data items`);
    }
    
    return validData;
  }, [data, validator]);
};

// Usage
const SafeUserGrid = () => {
  const rawData = fetchUserData(); // unknown[]
  const validUsers = useValidatedGridData(rawData, isValidUser);

  return (
    <ReusableAgGrid<User>
      data={validUsers}
      columns={columns}
    />
  );
};
```

This TypeScript guide ensures type safety throughout your grid implementation, from data interfaces to event handlers and custom renderers. The patterns shown here help catch errors at compile time and provide excellent IntelliSense support in your IDE.
