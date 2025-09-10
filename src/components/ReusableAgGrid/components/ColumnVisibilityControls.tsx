import React from 'react';
import type { GridColumn } from '../types';

interface ColumnVisibilityControlsProps<T> {
  columns: GridColumn<T>[];
  columnVisibility: {[key: string]: boolean};
  onToggleVisibility: (fieldName: string) => void;
  title?: string;
  containerStyle?: React.CSSProperties;
  checkboxStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  disabled?: boolean;
}

export const ColumnVisibilityControls = <T,>({
  columns,
  columnVisibility,
  onToggleVisibility,
  title = "Column Visibility",
  containerStyle,
  checkboxStyle,
  labelStyle,
  titleStyle,
  disabled = false
}: ColumnVisibilityControlsProps<T>) => {
  
  const defaultContainerStyle: React.CSSProperties = {
    marginBottom: '15px',
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
    ...containerStyle
  };

  const defaultTitleStyle: React.CSSProperties = {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    ...titleStyle
  };

  const defaultLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '13px',
    color: disabled ? '#999' : '#555',
    opacity: disabled ? 0.6 : 1,
    ...labelStyle
  };

  const defaultCheckboxStyle: React.CSSProperties = {
    marginRight: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...checkboxStyle
  };

  if (columns.length === 0) {
    return null;
  }

  return (
    <div style={defaultContainerStyle}>
      <h4 style={defaultTitleStyle}>{title}</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {columns.map(col => (
          <label 
            key={col.colId} 
            style={defaultLabelStyle}
            title={disabled ? 'Column controls disabled' : `Toggle ${col.headerName} column`}
          >
            <input
              type="checkbox"
              checked={columnVisibility[col.colId] || false}
              onChange={() => !disabled && onToggleVisibility(col.colId)}
              disabled={disabled}
              style={defaultCheckboxStyle}
              aria-label={`Toggle ${col.headerName} column visibility`}
            />
            <span>{col.headerName}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnVisibilityControls;
