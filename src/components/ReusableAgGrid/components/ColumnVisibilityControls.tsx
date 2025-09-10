import React, { useState, useRef, useEffect } from 'react';
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
  buttonText?: string;
  buttonStyle?: React.CSSProperties;
  popoverStyle?: React.CSSProperties;
  variant?: 'icon' | 'text' | 'both';
  position?: 'left' | 'right';
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
  disabled = false,
  buttonText = "Columns",
  buttonStyle,
  popoverStyle,
  variant = 'both',
  position = 'left'
}: ColumnVisibilityControlsProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const defaultButtonStyle: React.CSSProperties = {
    padding: variant === 'icon' ? '8px' : '8px 12px',
    backgroundColor: '#ffffff',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: disabled ? '#999' : '#333',
    opacity: disabled ? 0.6 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    minWidth: variant === 'icon' ? '36px' : 'auto',
    justifyContent: 'center',
    ...buttonStyle
  };

  const defaultContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...containerStyle
  };

  const defaultPopoverStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    ...(position === 'right' ? { right: '0' } : { left: '0' }),
    zIndex: 1000,
    marginTop: '4px',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    minWidth: '220px',
    maxWidth: '300px',
    maxHeight: '400px',
    overflowY: 'auto',
    ...popoverStyle
  };

  const defaultTitleStyle: React.CSSProperties = {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '8px',
    ...titleStyle
  };

  const defaultLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '13px',
    color: disabled ? '#999' : '#555',
    opacity: disabled ? 0.6 : 1,
    padding: '6px 4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    ...labelStyle
  };

  const defaultCheckboxStyle: React.CSSProperties = {
    marginRight: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...checkboxStyle
  };

  if (columns.length === 0) {
    return null;
  }

  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;

  // Icon for columns
  const columnIcon = "⚙️";
  
  const renderButtonContent = () => {
    switch (variant) {
      case 'icon':
        return (
          <>
            <span style={{ fontSize: '16px' }}>{columnIcon}</span>
            <span style={{ 
              fontSize: '9px', 
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#007acc',
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {visibleCount}
            </span>
          </>
        );
      case 'text':
        return (
          <>
            <span>{buttonText}</span>
            <span style={{ fontSize: '11px', color: '#666' }}>
              ({visibleCount}/{columns.length})
            </span>
            <span style={{ 
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: '10px'
            }}>
              ▼
            </span>
          </>
        );
      case 'both':
      default:
        return (
          <>
            <span style={{ fontSize: '14px' }}>{columnIcon}</span>
            <span>{buttonText}</span>
            <span style={{ fontSize: '11px', color: '#666' }}>
              ({visibleCount}/{columns.length})
            </span>
            <span style={{ 
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: '10px'
            }}>
              ▼
            </span>
          </>
        );
    }
  };

  return (
    <div style={defaultContainerStyle}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          ...defaultButtonStyle,
          backgroundColor: isOpen ? '#f0f8ff' : defaultButtonStyle.backgroundColor,
          borderColor: isOpen ? '#007acc' : defaultButtonStyle.borderColor,
          position: variant === 'icon' ? 'relative' : 'static'
        }}
        title={disabled ? 'Column controls disabled' : 'Configure column visibility'}
        aria-label="Column visibility controls"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = isOpen ? '#f0f8ff' : '#f8f9fa';
            e.currentTarget.style.borderColor = '#007acc';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = isOpen ? '#f0f8ff' : '#ffffff';
            e.currentTarget.style.borderColor = isOpen ? '#007acc' : '#d0d0d0';
          }
        }}
      >
        {renderButtonContent()}
      </button>

      {isOpen && (
        <div ref={popoverRef} style={defaultPopoverStyle}>
          <h4 style={defaultTitleStyle}>{title}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {columns.map(col => (
              <label 
                key={col.colId} 
                style={defaultLabelStyle}
                title={disabled ? 'Column controls disabled' : `Toggle ${col.headerName} column`}
                onMouseEnter={(e) => {
                  if (!disabled) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
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
      )}
    </div>
  );
};

export default ColumnVisibilityControls;
