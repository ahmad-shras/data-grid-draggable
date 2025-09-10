import React, { useState, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';

interface RowData {
  make: string;
  model: string;
  price: number;
  electric: boolean;
  year: number;
  category: string;
  color: string;
}

const GridExample: React.FC = () => {
  const [rowData] = useState<RowData[]>([
    { make: 'Toyota', model: 'Camry', price: 28450, electric: false, year: 2024, category: 'Sedan', color: 'White' },
    { make: 'Ford', model: 'F-150', price: 39900, electric: false, year: 2024, category: 'Truck', color: 'Red' },
    { make: 'Tesla', model: 'Model 3', price: 47990, electric: true, year: 2024, category: 'Sedan', color: 'Black' },
    { make: 'Chevrolet', model: 'Bolt EV', price: 31900, electric: true, year: 2024, category: 'Hatchback', color: 'Blue' },
    { make: 'BMW', model: 'X5', price: 60900, electric: false, year: 2024, category: 'SUV', color: 'Silver' },
    { make: 'Audi', model: 'e-tron', price: 65900, electric: true, year: 2024, category: 'SUV', color: 'Black' }
  ]);

  // Default column definitions
  const defaultColDefs: ColDef<RowData>[] = [
    { field: 'make', headerName: 'Make', colId: 'make', sortable: false },
    { field: 'model', headerName: 'Model', colId: 'model', sortable: false },
    { field: 'price', headerName: 'Price', colId: 'price', sortable: false },
    { field: 'electric', headerName: 'Electric', colId: 'electric', sortable: false },
    { field: 'year', headerName: 'Year', colId: 'year', sortable: false },
    { field: 'category', headerName: 'Category', colId: 'category', sortable: false },
    { field: 'color', headerName: 'Color', colId: 'color', sortable: false }
  ];

  const [colDefs, setColDefs] = useState<ColDef<RowData>[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>({});
  const gridApiRef = useRef<any>(null);

  // Initialize colDefs and visibility state from localStorage or defaults
  useEffect(() => {
    const savedColDefs = localStorage.getItem('agGridColDefs');
    const savedVisibility = localStorage.getItem('agGridColumnVisibility');

    if (savedColDefs && savedVisibility) {
      try {
        const parsedColDefs = JSON.parse(savedColDefs);
        const parsedVisibility = JSON.parse(savedVisibility);
        
        setColDefs(parsedColDefs);
        setColumnVisibility(parsedVisibility);
        console.log('Loaded column definitions and visibility from localStorage');
      } catch (e) {
        console.error('Failed to parse saved column definitions', e);
        initializeDefaults();
      }
    } else {
      initializeDefaults();
    }
  }, []);

  const initializeDefaults = () => {
    setColDefs(defaultColDefs);
    setColumnVisibility({
      make: true,
      model: true,
      price: true,
      electric: true,
      year: true,
      category: true,
      color: true
    });
  };

  const saveColumnState = () => {
    if (gridApiRef.current) {
      const columnState = gridApiRef.current.getColumnState();
      
      // Reconstruct colDefs based on current column state
      const newColDefs = columnState.map((state: any) => {
        const originalCol = defaultColDefs.find(col => col.colId === state.colId);
        return {
          ...originalCol,
          hide: !state.hide ? false : true, // AG-Grid uses hide: true for hidden columns
          width: state.width,
          pinned: state.pinned || null
        };
      });

      // Update visibility state
      const newVisibility: {[key: string]: boolean} = {};
      columnState.forEach((state: any) => {
        newVisibility[state.colId] = !state.hide;
      });

      // Save to localStorage
      localStorage.setItem('agGridColDefs', JSON.stringify(newColDefs));
      localStorage.setItem('agGridColumnVisibility', JSON.stringify(newVisibility));
      
      // Update React state
      setColDefs(newColDefs);
      setColumnVisibility(newVisibility);
      
      console.log('Column definitions and visibility saved:', { newColDefs, newVisibility });
    }
  };

  const toggleColumnVisibility = (fieldName: string) => {
    const newVisibility = !columnVisibility[fieldName];
    
    // Update visibility state
    setColumnVisibility(prev => ({
      ...prev,
      [fieldName]: newVisibility
    }));

    // Update grid using AG-Grid API
    if (gridApiRef.current) {
      gridApiRef.current.setColumnsVisible([fieldName], newVisibility);
    }
  };

  const onGridReady = (params: any) => {
    gridApiRef.current = params.api;
    console.log('Grid ready - no column state application needed!');
  };

  const onColumnMoved = () => {
    saveColumnState();
    console.log('Column moved - state saved');
  };

  const onColumnVisible = () => {
    saveColumnState();
    console.log('Column visibility changed - state saved');
  };

  const onColumnResized = (params: any) => {
    if (params.finished) {
      saveColumnState();
      console.log('Column resized - state saved');
    }
  };

  const resetColumns = () => {
    localStorage.removeItem('agGridColDefs');
    localStorage.removeItem('agGridColumnVisibility');
    window.location.reload();
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={resetColumns}
          style={{ padding: '5px 10px', marginRight: '10px' }}
        >
          Reset Columns
        </button>
        <span style={{ fontSize: '12px', color: '#666' }}>
          No animation on refresh! Column order comes directly from localStorage.
        </span>
      </div>

      <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd' }}>
        <h4>Column Visibility</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {defaultColDefs.map(col => (
            <label key={col.field} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={columnVisibility[col.field!] || false}
                onChange={() => toggleColumnVisibility(col.field!)}
                style={{ marginRight: '5px' }}
              />
              {col.headerName}
            </label>
          ))}
        </div>
      </div>

      <AgGridReact<RowData>
        rowData={rowData}
        columnDefs={colDefs} // This now comes pre-ordered from localStorage
        onGridReady={onGridReady}
        onColumnMoved={onColumnMoved}
        onColumnVisible={onColumnVisible}
        onColumnResized={onColumnResized}
        suppressMovableColumns={false}
        
        sideBar={{
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
            }
          ],
          defaultToolPanel: 'columns'
        }}
      />
    </div>
  );
};

export default GridExample;
