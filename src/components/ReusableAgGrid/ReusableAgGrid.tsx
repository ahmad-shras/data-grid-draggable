import React, { useRef, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useColumnPersistence } from './hooks/useColumnPersistence';
import { ColumnVisibilityControls } from './components/ColumnVisibilityControls';
import type { ReusableAgGridProps, GridConfig } from './types';

// Import AG Grid CSS (you'll need these in your index.css or import here)
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

const defaultConfig: Required<GridConfig> = {
  enableColumnVisibilityControls: true,
  columnVisibilityButtonVariant: 'both',
  columnVisibilityButtonPosition: 'left',
  columnVisibilityButtonText: 'Columns',
  enableSidebar: true,
  enableColumnPersistence: true,
  storageKey: 'agGrid',
  suppressMovableColumns: false,
  animateRows: true,
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: false
  },
  pagination: false,
  paginationPageSize: 10,
  rowSelection: 'single'
};

export const ReusableAgGrid = <T,>({
  data,
  columns,
  config = {},
  onGridReady,
  onColumnMoved,
  onColumnVisible,
  onColumnResized,
  onRowClicked,
  onRowSelected,
  onCellClicked,
  className = 'ag-theme-alpine',
  style,
  height = 500,
  width = '100%'
}: ReusableAgGridProps<T>) => {
  const gridApiRef = useRef<any>(null);
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  
  const {
    columns: persistedColumns,
    columnVisibility,
    isLoaded,
    saveColumnState,
    resetColumns,
    toggleColumnVisibility,
    setGridApi
  } = useColumnPersistence({
    defaultColumns: columns,
    storageKey: mergedConfig.storageKey,
    enabled: mergedConfig.enableColumnPersistence
  });

  // Event Handlers
  const handleGridReady = useCallback((params: any) => {
    gridApiRef.current = params.api;
    setGridApi(params.api);
    console.log('🚀 Grid ready with', data.length, 'rows');
    onGridReady?.(params);
  }, [data.length, onGridReady, setGridApi]);

  const handleColumnMoved = useCallback((params: any) => {
    console.log('🔄 Column moved:', params.column?.getColId());
    saveColumnState(gridApiRef.current);
    onColumnMoved?.(params);
  }, [saveColumnState, onColumnMoved]);

  const handleColumnVisible = useCallback((params: any) => {
    const columnId = params.column?.getColId();
    const visible = params.visible;
    console.log('👁️ Column visibility changed:', columnId, visible);
    saveColumnState(gridApiRef.current);
    onColumnVisible?.(params);
  }, [saveColumnState, onColumnVisible]);

  const handleColumnResized = useCallback((params: any) => {
    if (params.finished) {
      console.log('📏 Column resized:', params.column?.getColId(), params.column?.getActualWidth());
      saveColumnState(gridApiRef.current);
    }
    onColumnResized?.(params);
  }, [saveColumnState, onColumnResized]);

  const handleToggleVisibility = useCallback((fieldName: string) => {
    console.log('🔲 Toggling column visibility:', fieldName);
    toggleColumnVisibility(fieldName, gridApiRef.current);
  }, [toggleColumnVisibility]);

  const handleReset = useCallback(() => {
    console.log('🔄 Resetting columns to default state');
    resetColumns();
  }, [resetColumns]);

  // Sidebar Configuration
  const sideBarConfig = useMemo(() => {
    if (!mergedConfig.enableSidebar) return false;
    
    return {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressColumnFilter: false,
            suppressColumnSelectAll: false,
            suppressColumnExpandAll: false
          }
        }
      ],
      defaultToolPanel: 'columns'
    };
  }, [mergedConfig.enableSidebar]);

  // Grid Props
  const gridProps = useMemo(() => ({
    rowData: data,
    columnDefs: persistedColumns.map((col: any) => ({
      ...col,
      field: typeof col.field === 'string' ? col.field : String(col.field)
    })),
    onGridReady: handleGridReady,
    onColumnMoved: handleColumnMoved,
    onColumnVisible: handleColumnVisible,
    onColumnResized: handleColumnResized,
    onRowClicked: onRowClicked,
    onRowSelected: onRowSelected,
    onCellClicked: onCellClicked,
    suppressMovableColumns: mergedConfig.suppressMovableColumns,
    animateRows: mergedConfig.animateRows,
    sideBar: sideBarConfig,
    defaultColDef: mergedConfig.defaultColDef,
    pagination: mergedConfig.pagination,
    paginationPageSize: mergedConfig.paginationPageSize,
    rowSelection: mergedConfig.rowSelection,
    // Spread any additional config
    ...Object.fromEntries(
      Object.entries(mergedConfig).filter(([key]) => 
        ![
          'enableColumnVisibilityControls', 
          'columnVisibilityButtonVariant',
          'columnVisibilityButtonPosition', 
          'columnVisibilityButtonText',
          'enableSidebar', 
          'enableColumnPersistence', 
          'storageKey'
        ].includes(key)
      )
    )
  }), [
    data,
    persistedColumns,
    handleGridReady,
    handleColumnMoved,
    handleColumnVisible,
    handleColumnResized,
    onRowClicked,
    onRowSelected,
    onCellClicked,
    sideBarConfig,
    mergedConfig
  ]);

  const containerStyle: React.CSSProperties = useMemo(() => ({
    height,
    width,
    ...style
  }), [height, width, style]);

  // Don't render until columns are loaded
  if (!isLoaded) {
    return (
      <div style={containerStyle} className={className}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          fontSize: '14px',
          color: '#666'
        }}>
          Loading grid...
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {/* Toolbar with controls */}
      {(mergedConfig.enableColumnVisibilityControls || mergedConfig.enableColumnPersistence) && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px',
          padding: '8px 0',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {/* Left side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {mergedConfig.enableColumnVisibilityControls && (
              <ColumnVisibilityControls
                columns={columns}
                columnVisibility={columnVisibility}
                onToggleVisibility={handleToggleVisibility}
                disabled={!isLoaded}
                variant={mergedConfig.columnVisibilityButtonVariant}
                position={mergedConfig.columnVisibilityButtonPosition}
                buttonText={mergedConfig.columnVisibilityButtonText}
              />
            )}
            {mergedConfig.enableColumnPersistence && (
              <button 
                onClick={handleReset}
                disabled={!isLoaded}
                style={{ 
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: isLoaded ? 'pointer' : 'not-allowed',
                  backgroundColor: isLoaded ? '#f0f0f0' : '#e0e0e0',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                title="Reset all columns to default state"
              >
                🔄 Reset Columns
              </button>
            )}
          </div>
          
          {/* Right side info */}
          {mergedConfig.enableColumnPersistence && (
            <div style={{ fontSize: '11px', color: '#666' }}>
              {data.length} rows • Columns auto-saved
            </div>
          )}
        </div>
      )}

      {/* AG Grid */}
      <AgGridReact<T> {...gridProps} />
    </div>
  );
};

export default ReusableAgGrid;
