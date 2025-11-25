import React, { useState } from 'react';
import { Bold, Italic, Strikethrough, Link as LinkIcon, Code } from 'lucide-react';

interface BubbleMenuProps {
    position: { top: number; left: number };
    onClose: () => void;
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({ position, onClose }) => {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const savedSelection = React.useRef<Range | null>(null);

    // Save selection when bubble menu is shown
    React.useEffect(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedSelection.current = selection.getRangeAt(0).cloneRange();
        }
    }, []);

    const exec = (cmd: string, arg?: string) => {
        // Restore selection before executing command
        if (savedSelection.current) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(savedSelection.current);
            }
        }
        document.execCommand(cmd, false, arg);
        // Re-save selection after command
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedSelection.current = selection.getRangeAt(0).cloneRange();
        }
    };

    const handleLink = () => {
        if (linkUrl) {
            exec('createLink', linkUrl);
            setShowLinkInput(false);
            setLinkUrl('');
            onClose();
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: 'translateX(-50%)',
                zIndex: 100,
                backgroundColor: '#333',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
            }}
            onMouseDown={(e) => e.preventDefault()} // Prevent losing focus from editor
        >
            {!showLinkInput ? (
                <>
                    <button onClick={() => exec('bold')} className="bubble-btn">
                        <Bold size={16} color="white" />
                    </button>
                    <button onClick={() => exec('italic')} className="bubble-btn">
                        <Italic size={16} color="white" />
                    </button>
                    <button onClick={() => exec('strikeThrough')} className="bubble-btn">
                        <Strikethrough size={16} color="white" />
                    </button>
                    <button onClick={() => exec('formatBlock', 'PRE')} className="bubble-btn">
                        <Code size={16} color="white" />
                    </button>
                    <button onClick={() => setShowLinkInput(true)} className="bubble-btn">
                        <LinkIcon size={16} color="white" />
                    </button>
                </>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 4px' }}>
                    <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        style={{
                            background: '#444',
                            border: 'none',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            outline: 'none',
                            width: '150px'
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleLink();
                            if (e.key === 'Escape') setShowLinkInput(false);
                        }}
                        autoFocus
                    />
                    <button onClick={handleLink} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                        ↵
                    </button>
                </div>
            )}
            <style jsx>{`
        .bubble-btn {
          background: transparent;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bubble-btn:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
        </div>
    );
};

export default BubbleMenu;
