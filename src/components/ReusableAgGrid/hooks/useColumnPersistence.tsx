import { useState, useEffect, useCallback, useRef } from 'react';
import type { GridColumn,  } from '../types';
import type { StorageData } from '../types';

interface UseColumnPersistenceProps<T> {
  defaultColumns: GridColumn<T>[];
  storageKey: string;
  enabled: boolean;
}

export const useColumnPersistence = <T,>({
  defaultColumns,
  storageKey,
  enabled
}: UseColumnPersistenceProps<T>) => {
  const [columns, setColumns] = useState<GridColumn<T>[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<{[key: string]: boolean}>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const gridApiRef = useRef<any>(null);

  // Storage keys
  const colDefsKey = `${storageKey}_agGrid_data`;

  const initializeDefaults = useCallback(() => {
    setColumns([...defaultColumns]);
    const defaultVisibility: {[key: string]: boolean} = {};
    defaultColumns.forEach(col => {
      defaultVisibility[col.colId] = !col.hide;
    });
    setColumnVisibility(defaultVisibility);
    setIsLoaded(true);
  }, [defaultColumns]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!enabled) {
      initializeDefaults();
      return;
    }

    try {
      const savedData = localStorage.getItem(colDefsKey);
      
      if (savedData) {
        const parsedData: StorageData<T> = JSON.parse(savedData);
        
        // Validate data structure and check if columns match
        if (parsedData.columns && parsedData.visibility && 
            parsedData.columns.length === defaultColumns.length) {
          
          // Ensure all default columns exist in saved data
          const savedColIds = parsedData.columns.map(col => col.colId);
          const defaultColIds = defaultColumns.map(col => col.colId);
          const hasAllColumns = defaultColIds.every(id => savedColIds.includes(id));
          
          if (hasAllColumns) {
            setColumns(parsedData.columns);
            setColumnVisibility(parsedData.visibility);
            setIsLoaded(true);
            console.log('✅ Column state loaded from localStorage:', parsedData);
            return;
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to parse saved column state:', error);
    }

    // Fallback to defaults
    initializeDefaults();
  }, [enabled, colDefsKey, initializeDefaults, defaultColumns]);

  const saveColumnState = useCallback((gridApi?: any) => {
    if (!enabled || !isLoaded) return;
    
    const apiToUse = gridApi || gridApiRef.current;
    if (!apiToUse) return;

    try {
      const columnState = apiToUse.getColumnState();
      
      // Reconstruct columns based on current state
      const newColumns: GridColumn<T>[] = columnState.map((state: any) => {
        const originalCol = defaultColumns.find(col => col.colId === state.colId);
        if (!originalCol) return null;
        
        return {
          ...originalCol,
          hide: state.hide || false,
          width: state.width,
          pinned: state.pinned || null,
          sort: state.sort || null,
          sortIndex: state.sortIndex || null
        };
      }).filter(Boolean);

      // Update visibility state
      const newVisibility: {[key: string]: boolean} = {};
      columnState.forEach((state: any) => {
        newVisibility[state.colId] = !state.hide;
      });

      // Prepare data for storage
      const storageData: StorageData<T> = {
        columns: newColumns,
        visibility: newVisibility,
        timestamp: Date.now()
      };

      // Save to localStorage
      localStorage.setItem(colDefsKey, JSON.stringify(storageData));
      
      // Update state
      setColumns(newColumns);
      setColumnVisibility(newVisibility);
      
      console.log('💾 Column state saved:', storageData);
    } catch (error) {
      console.error('❌ Failed to save column state:', error);
    }
  }, [enabled, isLoaded, colDefsKey, defaultColumns]);

  const resetColumns = useCallback(() => {
    if (enabled) {
      localStorage.removeItem(colDefsKey);
      console.log('🗑️ Column state cleared from localStorage');
    }
    initializeDefaults();
  }, [enabled, colDefsKey, initializeDefaults]);

  const toggleColumnVisibility = useCallback((fieldName: string, gridApi?: any) => {
    const newVisibility = !columnVisibility[fieldName];
    
    setColumnVisibility(prev => ({
      ...prev,
      [fieldName]: newVisibility
    }));

    const apiToUse = gridApi || gridApiRef.current;
    if (apiToUse) {
      apiToUse.setColumnsVisible([fieldName], newVisibility);
    }
  }, [columnVisibility]);

  const setGridApi = useCallback((api: any) => {
    gridApiRef.current = api;
  }, []);

  return {
    columns,
    columnVisibility,
    isLoaded,
    saveColumnState,
    resetColumns,
    toggleColumnVisibility,
    setGridApi
  };
};
