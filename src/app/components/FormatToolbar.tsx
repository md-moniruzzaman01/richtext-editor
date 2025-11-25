"use client"
import React from 'react';
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    List,
    ListOrdered,
    Undo2,
    Redo2
} from 'lucide-react';

interface FormatToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const FormatToolbar: React.FC<FormatToolbarProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
    const exec = (cmd: string, arg?: string) => {
        // Ensure editor stays focused
        document.execCommand(cmd, false, arg);
    };

    // Prevent losing focus when clicking toolbar
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div style={{
            borderBottom: '1px solid #e0e0e0',
            background: '#f9f9f9',
            padding: '8px 16px',
            display: 'flex',
            gap: '4px',
            alignItems: 'center'
        }}>
            {/* Undo/Redo */}
            <button
                className="toolbar-btn"
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
            >
                <Undo2 size={18} />
            </button>
            <button
                className="toolbar-btn"
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
            >
                <Redo2 size={18} />
            </button>

            <div style={{ width: '1px', height: '24px', background: '#e0e0e0', margin: '0 4px' }} />

            {/* Font formatting */}
            <button className="toolbar-btn" onMouseDown={handleMouseDown} onClick={() => exec('bold')} title="Bold (Ctrl+B)">
                <Bold size={18} />
            </button>
            <button className="toolbar-btn" onMouseDown={handleMouseDown} onClick={() => exec('italic')} title="Italic (Ctrl+I)">
                <Italic size={18} />
            </button>
            <button className="toolbar-btn" onMouseDown={handleMouseDown} onClick={() => exec('underline')} title="Underline (Ctrl+U)">
                <Underline size={18} />
            </button>

            <div style={{ width: '1px', height: '24px', background: '#e0e0e0', margin: '0 4px' }} />

            {/* Heading styles dropdown */}
            <select
                onChange={(e) => {
                    const tag = e.target.value;
                    if (tag) exec('formatBlock', tag);
                    e.target.value = '';
                }}
                defaultValue=""
                style={{
                    padding: '4px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    background: 'white'
                }}
            >
                <option value="">Normal text</option>
                <option value="H1">Heading 1</option>
                <option value="H2">Heading 2</option>
                <option value="H3">Heading 3</option>
                <option value="P">Paragraph</option>
            </select>

            <div style={{ width: '1px', height: '24px', background: '#e0e0e0', margin: '0 4px' }} />

            {/* Text color */}
            <label
                className="toolbar-btn"
                style={{ cursor: 'pointer', padding: '4px 8px', position: 'relative' }}
                title="Text color"
                onMouseDown={(e) => e.preventDefault()}
            >
                <span style={{ borderBottom: '3px solid #000', paddingBottom: '2px', fontSize: '16px', fontWeight: 'bold' }}>A</span>
                <input
                    type="color"
                    onChange={(e) => {
                        exec('foreColor', e.target.value);
                        e.currentTarget.parentElement?.querySelector('span')?.style.setProperty('border-bottom-color', e.target.value);
                    }}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        cursor: 'pointer'
                    }}
                />
            </label>

            {/* Background/Highlight color */}
            <label
                className="toolbar-btn"
                style={{ cursor: 'pointer', padding: '4px 8px', position: 'relative' }}
                title="Highlight color"
                onMouseDown={(e) => e.preventDefault()}
            >
                <span style={{ background: '#ffeb3b', padding: '2px 4px', borderRadius: '2px', fontSize: '16px', fontWeight: 'bold' }}>A</span>
                <input
                    type="color"
                    defaultValue="#ffeb3b"
                    onChange={(e) => {
                        exec('backColor', e.target.value);
                        e.currentTarget.parentElement?.querySelector('span')?.style.setProperty('background', e.target.value);
                    }}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        cursor: 'pointer'
                    }}
                />
            </label>

            <div style={{ width: '1px', height: '24px', background: '#e0e0e0', margin: '0 4px' }} />

            {/* Alignment */}
            <button className="toolbar-btn" onMouseDown={handleMouseDown} onClick={() => exec('justifyLeft')} title="Align left">
                <AlignLeft size={18} />
            </button>
            <button className="toolbar-btn" onMouseDown={handleMouseDown} onClick={() => exec('justifyCenter')} title="Align center">
                <AlignCenter size={18} />
            </button>
            <button className="toolbar-btn" onMouseDown={handleMouseDown} onClick={() => exec('justifyRight')} title="Align right">
                <AlignRight size={18} />
            </button>

            <div style={{ width: '1px', height: '24px', background: '#e0e0e0', margin: '0 4px' }} />

            {/* Lists */}
            <button className="toolbar-btn" onMouseDown={handleMouseDown} onClick={() => exec('insertUnorderedList')} title="Bullet list">
                <List size={18} />
            </button>
            <button className="toolbar-btn" onMouseDown={handleMouseDown} onClick={() => exec('insertOrderedList')} title="Numbered list">
                <ListOrdered size={18} />
            </button>

            <div style={{ width: '1px', height: '24px', background: '#e0e0e0', margin: '0 4px' }} />

            {/* Link */}
            <button
                className="toolbar-btn"
                onMouseDown={handleMouseDown}
                onClick={() => {
                    const url = window.prompt('Enter URL:');
                    if (url) exec('createLink', url);
                }}
                title="Insert link"
            >
                <LinkIcon size={18} />
            </button>

            <style jsx>{`
        .toolbar-btn {
          background: transparent;
          border: none;
          padding: 6px;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #444;
          transition: background 0.15s ease;
        }
        .toolbar-btn:hover:not(:disabled) {
          background: #e8e8e8;
        }
        .toolbar-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default FormatToolbar;
