"use client"
import React, { useRef, useState, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered,
  Undo2, Redo2,
  Link as LinkIcon,
  Code,
  Table as TableIcon
} from 'lucide-react';
import Navbar from './components/Navbar';

const RichTextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // Auto-focus editor on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const rows = parseInt(prompt('Number of rows:') || '3');
    const cols = parseInt(prompt('Number of columns:') || '3');

    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tbody>';
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML += '<td style="border: 1px solid #ddd; padding: 8px; min-width: 100px; min-height: 30px;">&nbsp;</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';

    exec('insertHTML', tableHTML);
  };

  const handleLink = () => {
    if (linkUrl) {
      exec('createLink', linkUrl);
      setShowLinkInput(false);
      setLinkUrl('');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f9f9f9' }}>
      {/* Navbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#f9f9f9' }}>
        <Navbar />

        {/* Format Toolbar */}
        <div style={{
          borderBottom: '1px solid #e0e0e0',
          background: '#f9f9f9',
          padding: '8px 16px',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Undo/Redo */}
          <button className="toolbar-btn" onClick={() => exec('undo')} title="Undo (Ctrl+Z)">
            <Undo2 size={18} />
          </button>
          <button className="toolbar-btn" onClick={() => exec('redo')} title="Redo (Ctrl+Y)">
            <Redo2 size={18} />
          </button>

          <div className="divider" />

          {/* Text formatting */}
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('bold')} title="Bold (Ctrl+B)">
            <Bold size={18} />
          </button>
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('italic')} title="Italic (Ctrl+I)">
            <Italic size={18} />
          </button>
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('underline')} title="Underline (Ctrl+U)">
            <Underline size={18} />
          </button>
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('strikeThrough')} title="Strikethrough">
            <Strikethrough size={18} />
          </button>

          <div className="divider" />

          {/* Font size */}
          <select
            onChange={(e) => {
              if (e.target.value) exec('fontSize', e.target.value);
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
            <option value="">Font Size</option>
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>

          {/* Headings */}
          <select
            onChange={(e) => {
              if (e.target.value) exec('formatBlock', e.target.value);
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
            <option value="">Text Style</option>
            <option value="H1">Heading 1</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
            <option value="P">Paragraph</option>
          </select>

          <div className="divider" />

          {/* Text color */}
          <label className="toolbar-btn" style={{ cursor: 'pointer', padding: '4px 8px', position: 'relative' }} title="Text color">
            <span style={{ borderBottom: '3px solid #000', paddingBottom: '2px', fontSize: '16px', fontWeight: 'bold' }}>A</span>
            <input
              type="color"
              onChange={(e) => exec('foreColor', e.target.value)}
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

          {/* Highlight color */}
          <label className="toolbar-btn" style={{ cursor: 'pointer', padding: '4px 8px', position: 'relative' }} title="Highlight color">
            <span style={{ background: '#ffeb3b', padding: '2px 4px', borderRadius: '2px', fontSize: '16px', fontWeight: 'bold' }}>A</span>
            <input
              type="color"
              defaultValue="#ffeb3b"
              onChange={(e) => exec('backColor', e.target.value)}
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

          <div className="divider" />

          {/* Alignment */}
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('justifyLeft')} title="Align left">
            <AlignLeft size={18} />
          </button>
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('justifyCenter')} title="Align center">
            <AlignCenter size={18} />
          </button>
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('justifyRight')} title="Align right">
            <AlignRight size={18} />
          </button>
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('justifyFull')} title="Justify">
            <AlignJustify size={18} />
          </button>

          <div className="divider" />

          {/* Lists */}
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('insertUnorderedList')} title="Bullet list">
            <List size={18} />
          </button>
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('insertOrderedList')} title="Numbered list">
            <ListOrdered size={18} />
          </button>

          <div className="divider" />

          {/* Code block */}
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={() => exec('formatBlock', 'PRE')} title="Code block">
            <Code size={18} />
          </button>

          {/* Link */}
          {!showLinkInput ? (
            <button
              className="toolbar-btn"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setShowLinkInput(true)}
              title="Insert link"
            >
              <LinkIcon size={18} />
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', padding: '4px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  border: 'none',
                  padding: '4px 8px',
                  fontSize: '14px',
                  outline: 'none',
                  width: '200px'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLink();
                  if (e.key === 'Escape') setShowLinkInput(false);
                }}
                autoFocus
              />
              <button onClick={handleLink} style={{ background: '#1a73e8', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                Add
              </button>
              <button onClick={() => setShowLinkInput(false)} style={{ background: 'transparent', border: 'none', padding: '4px 8px', cursor: 'pointer', fontSize: '14px' }}>
                Cancel
              </button>
            </div>
          )}

          {/* Table */}
          <button className="toolbar-btn" onMouseDown={e => e.preventDefault()} onClick={insertTable} title="Insert table">
            <TableIcon size={18} />
          </button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          spellCheck={true}
          style={{
            background: 'white',
            width: '100%',
            maxWidth: '816px',
            minHeight: '1056px',
            padding: '96px 96px',
            boxShadow: '0 0 4px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '11pt',
            lineHeight: '1.5',
            color: '#202124',
            outline: 'none',
          }}
        />
      </div>

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
        .toolbar-btn:hover {
          background: #e8e8e8;
        }
        .divider {
          width: 1px;
          height: 24px;
          background: #e0e0e0;
          margin: 0 4px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
