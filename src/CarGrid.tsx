import React, { useState, useMemo } from 'react';
import ReusableAgGrid from './components/ReusableAgGrid';
import type { GridColumn, GridConfig } from './components/ReusableAgGrid/types';
interface Car {
  id: number;
  make: string;
  model: string;
  price: number;
  electric: boolean;
  year: number;
  category: string;
  color: string;
  rating: number;
}

const CarGrid: React.FC = () => {
  // Sample data
  const [carData] = useState<Car[]>([
    { id: 1, make: 'Toyota', model: 'Camry', price: 28450, electric: false, year: 2024, category: 'Sedan', color: 'White', rating: 4.5 },
    { id: 2, make: 'Ford', model: 'F-150', price: 39900, electric: false, year: 2024, category: 'Truck', color: 'Red', rating: 4.3 },
    { id: 3, make: 'Tesla', model: 'Model 3', price: 47990, electric: true, year: 2024, category: 'Sedan', color: 'Black', rating: 4.8 },
    { id: 4, make: 'Chevrolet', model: 'Bolt EV', price: 31900, electric: true, year: 2024, category: 'Hatchback', color: 'Blue', rating: 4.2 },
    { id: 5, make: 'BMW', model: 'X5', price: 60900, electric: false, year: 2024, category: 'SUV', color: 'Silver', rating: 4.6 },
    { id: 6, make: 'Audi', model: 'e-tron', price: 65900, electric: true, year: 2024, category: 'SUV', color: 'Black', rating: 4.4 }
  ]);

  // Column definitions
  const columns = useMemo<GridColumn<Car>[]>(() => [
    { 
      field: 'id', 
      headerName: 'ID', 
      colId: 'id', 
      sortable: true, 
      width: 80,
    //   pinned: 'left'
    },
    { 
      field: 'make', 
      headerName: 'Make', 
      colId: 'make', 
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'model', 
      headerName: 'Model', 
      colId: 'model', 
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'price', 
      headerName: 'Price ($)', 
      colId: 'price', 
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => `$${params.value.toLocaleString()}`
    },
    { 
      field: 'electric', 
      headerName: 'Electric', 
      colId: 'electric', 
      sortable: false,
      cellRenderer: (params) => params.value ? '⚡ Yes' : '⛽ No'
    },
    { 
      field: 'year', 
      headerName: 'Year', 
      colId: 'year', 
      sortable: true,
      filter: 'agNumberColumnFilter'
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      colId: 'category', 
      sortable: true,
      filter: 'agSetColumnFilter'
    },
    { 
      field: 'color', 
      headerName: 'Color', 
      colId: 'color', 
      sortable: false,
      cellStyle: (params) => ({
        backgroundColor: params.value.toLowerCase() === 'white' ? '#f9f9f9' : 
                         params.value.toLowerCase() === 'black' ? '#333' : 
                         params.value.toLowerCase() === 'red' ? '#ffebee' : 
                         params.value.toLowerCase() === 'blue' ? '#e3f2fd' : 
                         params.value.toLowerCase() === 'silver' ? '#f5f5f5' : 'inherit',
        color: params.value.toLowerCase() === 'black' ? 'white' : 'inherit'
      })
    },
    { 
      field: 'rating', 
      headerName: 'Rating', 
      colId: 'rating', 
      sortable: true,
      cellRenderer: (params) => '⭐'.repeat(Math.floor(params.value)) + ` ${params.value}`
    }
  ], []);

  // Grid configuration
  const gridConfig = useMemo<GridConfig>(() => ({
    storageKey: 'carGrid',
    enableColumnVisibilityControls: true,
    enableSidebar: true,
    enableColumnPersistence: true,
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true
    },
    pagination: true,
    paginationPageSize: 10,
    rowSelection: 'multiple'
  }), []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🚗 Car Inventory Management</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Manage your car inventory with sortable, filterable columns. 
        Column order and visibility are automatically saved!
      </p>
      
      <ReusableAgGrid<Car>
        data={carData}
        columns={columns}
        config={gridConfig}
        onRowClicked={(params) => {
          console.log('Car selected:', params.data);
          alert(`Selected: ${params.data.year} ${params.data.make} ${params.data.model}`);
        }}
        onRowSelected={(params) => {
          console.log('Row selection changed:', params.data);
        }}
        height={600}
      />
    </div>
  );
};

export default CarGrid;
