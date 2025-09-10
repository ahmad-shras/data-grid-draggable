# Advanced DataGrid Component

A comprehensive, production-ready React TypeScript data grid component built with AG Grid Community, featuring advanced column management, drag-and-drop reordering, visibility controls, and responsive design.

## 🚀 Features

### Core Features
- **Column Reordering**: Drag-and-drop column reordering with persistence
- **Column Visibility**: Show/hide columns with intuitive menu controls
- **Responsive Design**: Mobile-first responsive layout
- **TypeScript Support**: Full TypeScript integration with generics
- **Performance Optimized**: Virtualization for large datasets
- **Persistent State**: localStorage/sessionStorage integration
- **Customizable**: Extensive theming and styling options

### Advanced Features
- Row selection (single/multiple)
- Range selection
- Sorting and filtering
- Custom cell renderers
- Value formatters
- Loading and empty states
- Pinned columns
- Non-hideable/non-movable columns

## 📦 Installation

```bash
# Install the required dependencies
npm install ag-grid-community ag-grid-react
```

## 🎯 Quick Start

### Basic Usage

```tsx
import { DataGrid } from './components/DataGrid';
import type { DataGridColumn } from './components/DataGrid';

interface MyData {
  id: number;
  name: string;
  email: string;
  age: number;
}

const MyComponent = () => {
  const data: MyData[] = [
    { id: 1, name: "John Doe", email: "john@example.com", age: 30 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25 },
    // ... more data
  ];

  const columns: DataGridColumn<MyData>[] = [
    { 
      field: "id", 
      headerName: "ID",
      width: 80,
      hideable: false // Cannot be hidden
    },
    { 
      field: "name", 
      headerName: "Full Name",
      width: 150,
      filter: true,
      sortable: true
    },
    { 
      field: "email", 
      headerName: "Email Address",
      width: 200,
      filter: true
    },
    { 
      field: "age", 
      headerName: "Age",
      width: 100,
      filter: 'agNumberColumnFilter'
    }
  ];

  return (
    <DataGrid
      data={data}
      columns={columns}
      enableColumnReordering={true}
      enableColumnVisibility={true}
      height="500px"
    />
  );
};
```

## 📖 API Reference

### DataGridProps<T>

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **data** | `T[]` | **required** | Array of data objects to display |
| **columns** | `DataGridColumn<T>[]` | **required** | Column definitions |
| **enableColumnReordering** | `boolean` | `true` | Enable drag-and-drop column reordering |
| **enableColumnVisibility** | `boolean` | `true` | Enable column show/hide controls |
| **enableSorting** | `boolean` | `true` | Enable column sorting |
| **enableFiltering** | `boolean` | `true` | Enable column filtering |
| **enableRowSelection** | `boolean` | `false` | Enable row selection |
| **height** | `string \| number` | `'500px'` | Grid height |
| **width** | `string \| number` | `'100%'` | Grid width |
| **theme** | `'alpine' \| 'balham' \| 'material'` | `'alpine'` | AG Grid theme |
| **persistColumnState** | `boolean` | `false` | Persist column state to storage |
| **storageKey** | `string` | `'dataGrid_state'` | Storage key for persistence |

### DataGridColumn<T>

| Property | Type | Description |
|----------|------|-------------|
| **field** | `keyof T \| string` | **Required** - Field name in data object |
| **headerName** | `string` | Display name for column header |
| **width** | `number` | Fixed column width |
| **hideable** | `boolean` | Allow column to be hidden (default: true) |
| **suppressMovable** | `boolean` | Prevent column reordering |
| **pinned** | `'left' \| 'right'` | Pin column to left or right |
| **sortable** | `boolean` | Enable sorting for column |
| **filter** | `boolean \| string` | Enable filtering (true or filter type) |
| **valueFormatter** | `(params: any) => string` | Format cell values |
| **cellRenderer** | `string \| ((params: any) => any)` | Custom cell renderer |

## 🔧 Key Features Explained

### 1. Column Reordering
- **Drag and Drop**: Simply drag column headers to reorder
- **Persistence**: Column order is automatically saved to localStorage
- **Restrictions**: Set `suppressMovable: true` to prevent specific columns from moving
- **Pinned Columns**: Use `pinned: 'left'` or `pinned: 'right'` to fix column positions

### 2. Column Visibility Management
- **Menu Controls**: Click the "⚙️ Columns" button to access visibility controls
- **Checkbox Interface**: Each column has a checkbox to toggle visibility
- **Bulk Actions**: "Show All" and "Hide All" buttons for quick management
- **Non-hideable Columns**: Set `hideable: false` to prevent hiding critical columns
- **Persistence**: Visibility preferences are saved automatically

### 3. State Persistence
- **Automatic Saving**: Column order and visibility are saved to localStorage
- **Custom Storage Key**: Use unique `storageKey` for different grid instances
- **Reset Functionality**: "Reset" button restores default column layout

## 💡 Usage Examples

### Example 1: E-commerce Product Grid

```tsx
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

const ProductGrid = () => {
  const products: Product[] = [
    { id: "P001", name: "Laptop", category: "Electronics", price: 999, inStock: true },
    { id: "P002", name: "T-Shirt", category: "Clothing", price: 25, inStock: false },
  ];

  const columns: DataGridColumn<Product>[] = [
    { 
      field: "id", 
      headerName: "Product ID",
      width: 120,
      hideable: false,
      suppressMovable: true // Keep ID column fixed
    },
    { 
      field: "name", 
      headerName: "Product Name",
      width: 200,
      filter: true
    },
    { 
      field: "category", 
      headerName: "Category",
      width: 150,
      filter: true
    },
    { 
      field: "price", 
      headerName: "Price",
      width: 120,
      valueFormatter: (params) => `$${params.value}`,
      filter: 'agNumberColumnFilter'
    },
    { 
      field: "inStock", 
      headerName: "In Stock",
      width: 120,
      cellRenderer: (params) => 
        params.value ? '✅ Yes' : '❌ No'
    }
  ];

  return (
    <DataGrid
      data={products}
      columns={columns}
      enableColumnReordering={true}
      enableColumnVisibility={true}
      persistColumnState={true}
      storageKey="product_grid_preferences"
      height="400px"
    />
  );
};
```

### Example 2: User Management Grid

```tsx
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  lastLogin: string;
  active: boolean;
}

const UserGrid = () => {
  const columns: DataGridColumn<User>[] = [
    { 
      field: "id", 
      headerName: "ID",
      width: 80,
      hideable: false,
      pinned: 'left' // Always visible on left
    },
    { 
      field: "firstName", 
      headerName: "First Name",
      width: 150
    },
    { 
      field: "lastName", 
      headerName: "Last Name",
      width: 150
    },
    { 
      field: "email", 
      headerName: "Email",
      width: 200,
      filter: true
    },
    { 
      field: "role", 
      headerName: "Role",
      width: 120,
      filter: true
    },
    { 
      field: "lastLogin", 
      headerName: "Last Login",
      width: 180,
      valueFormatter: (params) => 
        new Date(params.value).toLocaleDateString()
    },
    { 
      field: "active", 
      headerName: "Status",
      width: 100,
      cellRenderer: (params) => 
        params.value 
          ? '<span style="color: green;">Active</span>' 
          : '<span style="color: red;">Inactive</span>'
    }
  ];

  const handleRowSelection = (selectedUsers: User[]) => {
    console.log('Selected users:', selectedUsers);
  };

  return (
    <DataGrid
      data={users}
      columns={columns}
      enableRowSelection={true}
      enableMultipleSelection={true}
      onRowSelectionChanged={handleRowSelection}
      initialHiddenColumns={['lastLogin']} // Hide last login by default
      height="500px"
    />
  );
};
```

## 🔍 Troubleshooting

### Common Issues

1. **Columns not reordering**
   - Ensure `enableColumnReordering={true}`
   - Check that columns don't have `suppressMovable: true`

2. **Column visibility menu not appearing**
   - Verify `enableColumnVisibility={true}`
   - Check for CSS z-index conflicts

3. **Persistence not working**
   - Check browser localStorage availability
   - Verify unique `storageKey` prop
   - Ensure `persistColumnState={true}`

## 🎨 Customization

### Custom Cell Renderers

```tsx
{
  field: "status",
  headerName: "Status",
  cellRenderer: (params) => {
    const color = params.value === 'active' ? 'green' : 'red';
    return `<span style="color: ${color}; font-weight: bold;">${params.value}</span>`;
  }
}
```

### Custom Value Formatters

```tsx
{
  field: "price",
  headerName: "Price",
  valueFormatter: (params) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(params.value)
}
```

## 📄 License

MIT License - Use freely in personal and commercial projects.
