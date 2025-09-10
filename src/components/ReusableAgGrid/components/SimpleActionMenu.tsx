import React, { useState, useRef, useEffect } from 'react';

interface SimpleActionMenuProps {
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

const SimpleActionMenu: React.FC<SimpleActionMenuProps> = ({
  data,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  customActions = []
}) => {
  console.log('SimpleActionMenu rendered with data:', data);
  
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
    e.preventDefault();
    console.log('Toggle menu clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAction = (action: () => void, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    console.log('Action triggered');
    action();
    setIsMenuOpen(false);
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        style={{
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
        }}
        title="Actions"
      >
        ⋮
      </button>

      {/* Simple dropdown menu without portal */}
      {isMenuOpen && (
        <div 
          ref={menuRef} 
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '140px',
            zIndex: 1000
          }}
        >
          {onView && (
            <div
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={(e) => handleAction(() => onView(data), e)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>👁️</span>
              <span>View</span>
            </div>
          )}
          
          {onEdit && (
            <div
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={(e) => handleAction(() => onEdit(data), e)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>✏️</span>
              <span>Edit</span>
            </div>
          )}
          
          {onDuplicate && (
            <div
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={(e) => handleAction(() => onDuplicate(data), e)}
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
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={(e) => handleAction(() => action.onClick(data), e)}
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
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                borderBottom: 'none',
                color: '#dc3545',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={(e) => handleAction(() => onDelete(data), e)}
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
      )}
    </div>
  );
};

export default SimpleActionMenu;
