"use client"
import React, { useRef, useState } from 'react';

const toolbarButtons = [
  { cmd: 'bold', icon: 'B', label: 'Bold' },
  { cmd: 'italic', icon: 'I', label: 'Italic' },
  { cmd: 'underline', icon: 'U', label: 'Underline' },
  { cmd: 'strikeThrough', icon: 'S', label: 'Strikethrough' },
  { cmd: 'insertUnorderedList', icon: '• List', label: 'Bullet List' },
  { cmd: 'insertOrderedList', icon: '1. List', label: 'Number List' },
  { cmd: 'undo', icon: '↺', label: 'Undo' },
  { cmd: 'redo', icon: '↻', label: 'Redo' },
];

const colors = [
  '#000000', '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080'
];

const RichTextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>('');

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '2em auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em 0.5em', padding: '8px', border: '1px solid #ccc', borderBottom: 'none', borderRadius: '8px 8px 0 0', background: '#f7f7f7' }}>
        {/* Main formatting toolbar */}
        {toolbarButtons.map(btn => (
          <button
            key={btn.cmd}
            title={btn.label}
            type="button"
            style={{ fontWeight: btn.cmd === 'bold' ? 700 : undefined, fontStyle: btn.cmd === 'italic' ? 'italic' : undefined, textDecoration: btn.cmd === 'underline' ? 'underline' : btn.cmd === 'strikeThrough' ? 'line-through' : undefined, padding: '2px 8px', minWidth: 28, border: 'none', background: '#fff', marginRight: 4, borderRadius: 4, cursor: 'pointer', boxShadow: '0 1px 2px 0 #eee' }}
            onMouseDown={e => e.preventDefault()}
            onClick={() => exec(btn.cmd)}
          >
            {btn.icon}
          </button>
        ))}
        {/* Headings dropdown */}
        <select
          defaultValue=""
          style={{ marginLeft: 8, padding: '2px 5px', borderRadius: 4 }}
          onChange={e => {
            const tag = e.target.value;
            if (tag) exec('formatBlock', tag);
            e.target.value = '';
          }}
        >
          <option value="">Text style</option>
          <option value="H1">Title (H1)</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
          <option value="P">Paragraph</option>
        </select>
        {/* Font color picker */}
        <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>A
          <input type="color" defaultValue="#000000" style={{ width: 24, height: 20, marginLeft: 2 }} onChange={e => exec('foreColor', e.target.value)} title="Text Color" />
        </span>
        {/* Highlight color picker */}
        <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>🖍️
          <input type="color" defaultValue="#ffff00" style={{ width: 24, height: 20, marginLeft: 2 }} onChange={e => exec('hiliteColor', e.target.value)} title="Highlight" />
        </span>
        {/* Links */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter a URL');
            if (url) exec('createLink', url);
          }}
          style={{ marginLeft: 10, borderRadius: 4, padding: '2px 8px' }}
        >🔗 Link
        </button>
      </div>
      {/* Editable content area */}
      <div
        ref={editorRef}
        contentEditable
        style={{ border: '1px solid #ccc', borderTop: 'none', minHeight: '200px', background: '#fff', borderRadius: '0 0 8px 8px', padding: '14px', outline: 'none', fontSize: '1.1rem', boxShadow: '0 2px 8px #f2f2f2' }}
        onInput={handleInput}
        suppressContentEditableWarning
      ></div>
      <p style={{ color: '#999', margin: '1em 0 .25em' }}>Editor State (HTML):</p>
      <pre style={{ background: '#f4f7f9', padding: '8px', minHeight: '40px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{content}</pre>
    </div>
  );
};

export default RichTextEditor;
