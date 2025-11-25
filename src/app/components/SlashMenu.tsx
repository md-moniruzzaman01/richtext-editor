import React, { useEffect, useRef } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Image as ImageIcon,
  Table as TableIcon
} from 'lucide-react';

interface SlashMenuProps {
  position: { top: number; left: number };
  onSelect: (type: string) => void;
  onClose: () => void;
}

const MENU_ITEMS = [
  { id: 'text', label: 'Text', icon: <Type size={18} /> },
  { id: 'h1', label: 'Heading 1', icon: <Heading1 size={18} /> },
  { id: 'h2', label: 'Heading 2', icon: <Heading2 size={18} /> },
  { id: 'h3', label: 'Heading 3', icon: <Heading3 size={18} /> },
  { id: 'bullet', label: 'Bullet List', icon: <List size={18} /> },
  { id: 'number', label: 'Numbered List', icon: <ListOrdered size={18} /> },
  { id: 'code', label: 'Code Block', icon: <Code size={18} /> },
  { id: 'table', label: 'Table', icon: <TableIcon size={18} /> },
  { id: 'image', label: 'Image', icon: <ImageIcon size={18} /> },
];

const SlashMenu: React.FC<SlashMenuProps> = ({ position, onSelect, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 100,
        backgroundColor: 'white',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid #eee',
        padding: '6px',
        width: '200px',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '4px 8px', fontSize: '12px', color: '#999', fontWeight: 600 }}>
        BASIC BLOCKS
      </div>
      {MENU_ITEMS.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.1s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ color: '#666' }}>{item.icon}</span>
          <span style={{ fontSize: '14px', color: '#333' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SlashMenu;
