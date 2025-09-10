import React, { useState, useRef, useEffect } from 'react';

interface ActionMenuProps {
  data: any;
  onEdit?: (data: any) => void;
  onView?: (data: any) => void;
  onDelete?: (data: any) => void;
  onDuplicate?: (data: any) => void;
  customActions?: Array<{
    label: string;
    icon?: string;
    onClick: (data: any) => void;
    className?: string;
  }>;
}

const ActionMenuCellRenderer: React.FC<ActionMenuProps> = ({
  data,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  customActions = []
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    minWidth: '140px',
    zIndex: 1000,
    display: isMenuOpen ? 'block' : 'none'
  };

  const menuItemStyle: React.CSSProperties = {
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '13px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s'
  };

  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        style={buttonStyle}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        title="Actions"
      >
        ⋮
      </button>

      <div ref={menuRef} style={menuStyle}>
        {onView && (
          <div
            style={menuItemStyle}
            onClick={() => handleAction(() => onView(data))}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span>👁️</span>
            <span>View</span>
          </div>
        )}
        
        {onEdit && (
          <div
            style={menuItemStyle}
            onClick={() => handleAction(() => onEdit(data))}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span>✏️</span>
            <span>Edit</span>
          </div>
        )}
        
        {onDuplicate && (
          <div
            style={menuItemStyle}
            onClick={() => handleAction(() => onDuplicate(data))}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span>📋</span>
            <span>Duplicate</span>
          </div>
        )}

        {/* Custom Actions */}
        {customActions.map((action, index) => (
          <div
            key={index}
            style={menuItemStyle}
            onClick={() => handleAction(() => action.onClick(data))}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            className={action.className}
          >
            {action.icon && <span>{action.icon}</span>}
            <span>{action.label}</span>
          </div>
        ))}
        
        {onDelete && (
          <div
            style={{
              ...menuItemStyle,
              borderBottom: 'none',
              color: '#dc3545'
            }}
            onClick={() => handleAction(() => onDelete(data))}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff5f5';
              e.currentTarget.style.color = '#dc3545';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#dc3545';
            }}
          >
            <span>🗑️</span>
            <span>Delete</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionMenuCellRenderer;
