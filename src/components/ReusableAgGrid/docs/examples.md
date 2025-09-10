# Usage Examples

## Table of Contents
- [Basic Examples](#basic-examples)
- [Column Visibility Controls](#column-visibility-controls)
- [Advanced Examples](#advanced-examples)
- [Real-World Scenarios](#real-world-scenarios)
- [Custom Renderers](#custom-renderers)
- [Performance Examples](#performance-examples)

## Basic Examples

### 1. Simple Data Display

```tsx
import React from 'react';
import { ReusableAgGrid } from '../components/ReusableAgGrid';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const ProductList = () => {
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Desk Chair', price: 299.99, category: 'Furniture' },
    { id: 3, name: 'Coffee Mug', price: 12.99, category: 'Kitchen' }
  ];

  const columns = [
    { field: 'id', headerName: 'ID', colId: 'id', width: 80 },
    { field: 'name', headerName: 'Product Name', colId: 'name', width: 200 },
    { 
      field: 'price', 
      headerName: 'Price', 
      colId: 'price', 
      width: 120,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    { field: 'category', headerName: 'Category', colId: 'category', width: 150 }
  ];

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ReusableAgGrid
        data={products}
        columns={columns}
        height={400}
      />
    </div>
  );
};
```

### 2. With Row Selection

```tsx
const SelectableGrid = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChanged = (params) => {
    const selected = params.api.getSelectedRows();
    setSelectedRows(selected);
    console.log('Selected products:', selected);
  };

  const config = {
    rowSelection: 'multiple',
    suppressRowDeselection: false
  };

  return (
    <div>
      <p>Selected: {selectedRows.length} items</p>
      <ReusableAgGrid
        data={products}
        columns={columns}
        config={config}
        onRowSelected={handleSelectionChanged}
        height={400}
      />
    </div>
  );
};
```

## Column Visibility Controls

### Modern Popover Interface

The new column visibility controls provide a professional popover menu interface with multiple customization options.

#### 1. Icon Button (Compact)

Perfect for mobile and space-constrained layouts:

```tsx
import React from 'react';
import { ReusableAgGrid, createGridConfig } from '../components/ReusableAgGrid';

interface CompactData {
  id: number;
  name: string;
  status: string;
  date: string;
}

const CompactGrid = () => {
  const data: CompactData[] = [
    { id: 1, name: 'Task 1', status: 'Active', date: '2024-01-15' },
    { id: 2, name: 'Task 2', status: 'Pending', date: '2024-01-16' },
    { id: 3, name: 'Task 3', status: 'Complete', date: '2024-01-17' }
  ];

  const columns = [
    { field: 'id', headerName: 'ID', colId: 'id', width: 70 },
    { field: 'name', headerName: 'Task Name', colId: 'name', width: 200 },
    { field: 'status', headerName: 'Status', colId: 'status', width: 120 },
    { field: 'date', headerName: 'Due Date', colId: 'date', width: 120 }
  ];

  const config = createGridConfig({
    columnVisibilityButtonVariant: 'icon',
    columnVisibilityButtonPosition: 'left',
    pagination: false
  });

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ReusableAgGrid
        data={data}
        columns={columns}
        config={config}
        height={300}
      />
    </div>
  );
};
```

#### 2. Text Button with Custom Label

Great for clear, accessible interfaces:

```tsx
const AdminGrid = () => {
  const config = createGridConfig({
    columnVisibilityButtonVariant: 'text',
    columnVisibilityButtonPosition: 'right',
    columnVisibilityButtonText: 'Configure View',
    pagination: false
  });

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReusableAgGrid
        data={userData}
        columns={userColumns}
        config={config}
        height={400}
      />
    </div>
  );
};
```

#### 3. Combined Icon + Text (Recommended)

The perfect balance of visual clarity and information:

```tsx
const DashboardGrid = () => {
  const config = createGridConfig({
    columnVisibilityButtonVariant: 'both',
    columnVisibilityButtonPosition: 'left',
    columnVisibilityButtonText: 'Table Settings',
    enableColumnPersistence: true,
    storageKey: 'dashboard-grid'
  });

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h3>Sales Dashboard</h3>
      <ReusableAgGrid
        data={salesData}
        columns={salesColumns}
        config={config}
        height={500}
      />
    </div>
  );
};
```

#### 4. Responsive Column Controls

Adapt the button variant based on screen size:

```tsx
import { useState, useEffect } from 'react';

const ResponsiveGrid = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const config = createGridConfig({
    columnVisibilityButtonVariant: isMobile ? 'icon' : 'both',
    columnVisibilityButtonPosition: isMobile ? 'right' : 'left',
    columnVisibilityButtonText: isMobile ? 'Cols' : 'Manage Columns',
    enableColumnVisibilityControls: true
  });

  return (
    <ReusableAgGrid
      data={responsiveData}
      columns={responsiveColumns}
      config={config}
      height={450}
    />
  );
};
```

#### 5. Custom Styled Controls

For advanced styling requirements:

```tsx
import { ColumnVisibilityControls } from '../components/ReusableAgGrid';

const CustomStyledGrid = () => {
  const [columnVisibility, setColumnVisibility] = useState({});
  
  const handleToggleVisibility = (fieldName: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  return (
    <div>
      {/* Custom toolbar with styled column controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0 }}>Custom Data Grid</h3>
        
        <ColumnVisibilityControls
          columns={customColumns}
          columnVisibility={columnVisibility}
          onToggleVisibility={handleToggleVisibility}
          variant="both"
          position="right"
          buttonText="View Options"
          buttonStyle={{
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontWeight: '600'
          }}
          popoverStyle={{
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e1e5e9'
          }}
          titleStyle={{
            color: '#007acc',
            borderBottom: '2px solid #007acc',
            paddingBottom: '8px'
          }}
        />
      </div>
      
      <ReusableAgGrid
        data={customData}
        columns={customColumns}
        config={{ enableColumnVisibilityControls: false }} // Use custom controls
        height={400}
      />
    </div>
  );
};
```

## Advanced Examples

### 3. E-commerce Dashboard

```tsx
interface OrderData {
  orderId: string;
  customerName: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: number;
}

const OrderDashboard = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  // Status cell renderer with color coding
  const StatusRenderer = (params) => {
    const statusColors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50'
    };

    return (
      <span 
        style={{
          color: statusColors[params.value],
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '12px'
        }}
      >
        {params.value}
      </span>
    );
  };

  // Actions cell renderer
  const ActionsRenderer = (params) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button 
        onClick={() => viewOrder(params.data.orderId)}
        style={{ fontSize: '12px', padding: '4px 8px' }}
      >
        View
      </button>
      {params.data.status === 'pending' && (
        <button 
          onClick={() => processOrder(params.data.orderId)}
          style={{ fontSize: '12px', padding: '4px 8px' }}
        >
          Process
        </button>
      )}
    </div>
  );

  const columns = [
    { 
      field: 'orderId', 
      headerName: 'Order ID', 
      colId: 'orderId',
      width: 120,
      pinned: 'left'
    },
    { 
      field: 'customerName', 
      headerName: 'Customer', 
      colId: 'customerName',
      width: 180
    },
    { 
      field: 'orderDate', 
      headerName: 'Date', 
      colId: 'orderDate',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      colId: 'status',
      width: 120,
      cellRenderer: StatusRenderer
    },
    { 
      field: 'total', 
      headerName: 'Total', 
      colId: 'total',
      width: 120,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      cellStyle: { textAlign: 'right', fontWeight: 'bold' }
    },
    { 
      field: 'items', 
      headerName: 'Items', 
      colId: 'items',
      width: 80,
      cellStyle: { textAlign: 'center' }
    },
    {
      headerName: 'Actions',
      colId: 'actions',
      width: 140,
      cellRenderer: ActionsRenderer,
      sortable: false,
      pinned: 'right'
    }
  ];

  const config = {
    pagination: true,
    paginationPageSize: 50,
    enableColumnPersistence: true,
    storageKey: 'order-dashboard',
    defaultColDef: {
      resizable: true,
      sortable: true
    }
  };

  const viewOrder = (orderId) => {
    console.log('Viewing order:', orderId);
    // Navigate to order details
  };

  const processOrder = (orderId) => {
    console.log('Processing order:', orderId);
    // Update order status
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <h2>Order Management Dashboard</h2>
      <ReusableAgGrid
        data={orders}
        columns={columns}
        config={config}
        height={550}
      />
    </div>
  );
};
```

### 4. Financial Data Grid

```tsx
interface StockData {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

const StockGrid = () => {
  // Price change cell renderer with color coding
  const PriceChangeRenderer = (params) => {
    const isPositive = params.value >= 0;
    return (
      <span style={{
        color: isPositive ? '#4caf50' : '#f44336',
        fontWeight: 'bold'
      }}>
        {isPositive ? '+' : ''}{params.value.toFixed(2)}
      </span>
    );
  };

  // Percentage change with arrow indicators
  const PercentChangeRenderer = (params) => {
    const isPositive = params.value >= 0;
    const arrow = isPositive ? '▲' : '▼';
    return (
      <span style={{
        color: isPositive ? '#4caf50' : '#f44336',
        fontWeight: 'bold'
      }}>
        {arrow} {Math.abs(params.value).toFixed(2)}%
      </span>
    );
  };

  // Volume formatter
  const volumeFormatter = (params) => {
    if (params.value >= 1000000) {
      return `${(params.value / 1000000).toFixed(1)}M`;
    } else if (params.value >= 1000) {
      return `${(params.value / 1000).toFixed(1)}K`;
    }
    return params.value.toLocaleString();
  };

  const columns = [
    { 
      field: 'symbol', 
      headerName: 'Symbol', 
      colId: 'symbol',
      width: 100,
      pinned: 'left',
      cellStyle: { fontWeight: 'bold' }
    },
    { 
      field: 'company', 
      headerName: 'Company', 
      colId: 'company',
      width: 200
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      colId: 'price',
      width: 120,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      cellStyle: { textAlign: 'right', fontWeight: 'bold' }
    },
    { 
      field: 'change', 
      headerName: 'Change', 
      colId: 'change',
      width: 120,
      cellRenderer: PriceChangeRenderer,
      cellStyle: { textAlign: 'right' }
    },
    { 
      field: 'changePercent', 
      headerName: 'Change %', 
      colId: 'changePercent',
      width: 120,
      cellRenderer: PercentChangeRenderer,
      cellStyle: { textAlign: 'right' }
    },
    { 
      field: 'volume', 
      headerName: 'Volume', 
      colId: 'volume',
      width: 120,
      valueFormatter: volumeFormatter,
      cellStyle: { textAlign: 'right' }
    },
    { 
      field: 'marketCap', 
      headerName: 'Market Cap', 
      colId: 'marketCap',
      width: 140,
      valueFormatter: (params) => `$${(params.value / 1000000000).toFixed(1)}B`,
      cellStyle: { textAlign: 'right' }
    }
  ];

  const config = {
    enableColumnPersistence: true,
    storageKey: 'stock-grid',
    animateRows: true,
    defaultColDef: {
      resizable: true,
      sortable: true
    }
  };

  return (
    <ReusableAgGrid
      data={stockData}
      columns={columns}
      config={config}
      height={500}
      className="ag-theme-alpine"
    />
  );
};
```

## Real-World Scenarios

### 5. Employee Management System

```tsx
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  startDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  manager?: string;
}

const EmployeeGrid = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // Avatar cell renderer
  const AvatarRenderer = (params) => {
    const initials = `${params.data.firstName[0]}${params.data.lastName[0]}`;
    return (
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#2196f3',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {initials}
      </div>
    );
  };

  // Full name renderer
  const NameRenderer = (params) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <AvatarRenderer params={params} />
      <span>{`${params.data.firstName} ${params.data.lastName}`}</span>
    </div>
  );

  // Department filter
  const departmentFilter = {
    filter: 'agSetColumnFilter',
    filterParams: {
      values: departments
    }
  };

  const columns = [
    {
      headerName: 'Employee',
      colId: 'employee',
      width: 200,
      cellRenderer: NameRenderer,
      sortable: false
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      colId: 'email',
      width: 220
    },
    { 
      field: 'department', 
      headerName: 'Department', 
      colId: 'department',
      width: 150,
      filter: departmentFilter
    },
    { 
      field: 'position', 
      headerName: 'Position', 
      colId: 'position',
      width: 180
    },
    { 
      field: 'salary', 
      headerName: 'Salary', 
      colId: 'salary',
      width: 120,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
      cellStyle: { textAlign: 'right' }
    },
    { 
      field: 'startDate', 
      headerName: 'Start Date', 
      colId: 'startDate',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      colId: 'status',
      width: 120,
      cellRenderer: (params) => {
        const statusColors = {
          active: '#4caf50',
          inactive: '#f44336',
          'on-leave': '#ff9800'
        };
        return (
          <span style={{
            color: statusColors[params.value],
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }}>
            {params.value.replace('-', ' ')}
          </span>
        );
      }
    }
  ];

  const config = {
    enableColumnPersistence: true,
    storageKey: 'employee-grid',
    pagination: true,
    paginationPageSize: 25,
    rowSelection: 'multiple',
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2>Employee Directory</h2>
        <p>Total Employees: {employees.length}</p>
      </div>
      
      <ReusableAgGrid
        data={employees}
        columns={columns}
        config={config}
        height={600}
      />
    </div>
  );
};
```

## Custom Renderers

### 6. Image Gallery Grid

```tsx
interface ImageData {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  tags: string[];
  uploadDate: string;
  size: number;
}

const ImageGalleryGrid = () => {
  // Image thumbnail renderer
  const ImageRenderer = (params) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px'
    }}>
      <img
        src={params.data.thumbnail}
        alt={params.data.title}
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'cover',
          borderRadius: '4px'
        }}
        onError={(e) => {
          e.target.src = '/placeholder-image.png';
        }}
      />
      <span>{params.data.title}</span>
    </div>
  );

  // Tags renderer
  const TagsRenderer = (params) => (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {params.value.slice(0, 3).map((tag, index) => (
        <span
          key={index}
          style={{
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            padding: '2px 6px',
            borderRadius: '12px',
            fontSize: '11px'
          }}
        >
          {tag}
        </span>
      ))}
      {params.value.length > 3 && (
        <span style={{ fontSize: '11px', color: '#666' }}>
          +{params.value.length - 3} more
        </span>
      )}
    </div>
  );

  // File size formatter
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns = [
    {
      headerName: 'Image',
      colId: 'image',
      width: 200,
      cellRenderer: ImageRenderer,
      sortable: false
    },
    {
      field: 'tags',
      headerName: 'Tags',
      colId: 'tags',
      width: 250,
      cellRenderer: TagsRenderer,
      sortable: false
    },
    {
      field: 'uploadDate',
      headerName: 'Uploaded',
      colId: 'uploadDate',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'size',
      headerName: 'Size',
      colId: 'size',
      width: 100,
      valueFormatter: (params) => formatFileSize(params.value),
      cellStyle: { textAlign: 'right' }
    }
  ];

  return (
    <ReusableAgGrid
      data={imageData}
      columns={columns}
      config={{
        rowHeight: 56, // Larger rows for images
        enableColumnPersistence: true,
        storageKey: 'image-gallery'
      }}
      height={500}
    />
  );
};
```

## Performance Examples

### 7. Large Dataset Handling

```tsx
const LargeDataGrid = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate large dataset
  useEffect(() => {
    const generateData = () => {
      const result = [];
      for (let i = 0; i < 10000; i++) {
        result.push({
          id: i,
          name: `Item ${i}`,
          value: Math.random() * 1000,
          category: `Category ${i % 10}`,
          date: new Date(2024, 0, i % 365).toISOString()
        });
      }
      return result;
    };

    // Simulate loading
    setTimeout(() => {
      setData(generateData());
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', colId: 'id', width: 80 },
    { field: 'name', headerName: 'Name', colId: 'name', width: 150 },
    { 
      field: 'value', 
      headerName: 'Value', 
      colId: 'value', 
      width: 120,
      valueFormatter: (params) => params.value.toFixed(2)
    },
    { field: 'category', headerName: 'Category', colId: 'category', width: 150 },
    { 
      field: 'date', 
      headerName: 'Date', 
      colId: 'date', 
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    }
  ];

  const config = {
    // Performance optimizations
    suppressRowVirtualisation: false,
    suppressColumnVirtualisation: false,
    suppressAnimationFrame: false,
    
    // Pagination for better UX
    pagination: true,
    paginationPageSize: 100,
    
    // Enable persistence
    enableColumnPersistence: true,
    storageKey: 'large-data-grid',
    
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true
    }
  };

  if (loading) {
    return (
      <div style={{ 
        height: '500px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        Loading 10,000 records...
      </div>
    );
  }

  return (
    <div>
      <p>Displaying {data.length} records with virtualization</p>
      <ReusableAgGrid
        data={data}
        columns={columns}
        config={config}
        height={500}
      />
    </div>
  );
};
```

### 8. Responsive Mobile Grid

```tsx
const ResponsiveGrid = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop columns
  const desktopColumns = [
    { field: 'id', headerName: 'ID', colId: 'id', width: 80 },
    { field: 'name', headerName: 'Name', colId: 'name', width: 150 },
    { field: 'email', headerName: 'Email', colId: 'email', width: 200 },
    { field: 'phone', headerName: 'Phone', colId: 'phone', width: 150 },
    { field: 'department', headerName: 'Department', colId: 'department', width: 150 },
    { field: 'status', headerName: 'Status', colId: 'status', width: 100 }
  ];

  // Mobile columns (essential only)
  const mobileColumns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      colId: 'name', 
      width: 150,
      cellRenderer: (params) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{params.value}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {params.data.department}
          </div>
        </div>
      )
    },
    { 
      field: 'email', 
      headerName: 'Contact', 
      colId: 'contact', 
      width: 200,
      cellRenderer: (params) => (
        <div>
          <div>{params.data.email}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {params.data.phone}
          </div>
        </div>
      ),
      sortable: false
    },
    { field: 'status', headerName: 'Status', colId: 'status', width: 80 }
  ];

  const config = {
    enableColumnVisibilityControls: !isMobile,
    enableSidebar: !isMobile,
    suppressMovableColumns: isMobile,
    rowHeight: isMobile ? 60 : 40
  };

  return (
    <ReusableAgGrid
      data={employeeData}
      columns={isMobile ? mobileColumns : desktopColumns}
      config={config}
      height={isMobile ? 400 : 500}
    />
  );
};
```

These examples demonstrate the versatility and power of the ReusableAgGrid component across various use cases, from simple data display to complex business applications with custom rendering and responsive behavior.
