import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import TableBlock from './TableBlock';

export type BlockType = 'text' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'image' | 'code' | 'table';

export interface Block {
    id: string;
    type: BlockType;
    content: string;
}

interface BlockComponentProps {
    block: Block;
    isFocused: boolean;
    updateBlock: (id: string, content: string) => void;
    addBlock: (currentId: string, afterContent?: string) => void;
    deleteBlock: (id: string) => void;
    onFocus: (id: string) => void;
    onKeyDown: (e: React.KeyboardEvent, id: string) => void;
    openSlashMenu: (id: string) => void;
}

const BlockComponent: React.FC<BlockComponentProps> = ({
    block,
    isFocused,
    updateBlock,
    addBlock,
    deleteBlock,
    onFocus,
    onKeyDown,
    openSlashMenu,
}) => {
    const contentRef = useRef<HTMLElement>(null);

    // Initialize content on mount
    useEffect(() => {
        if (contentRef.current) {
            // Always initialize with current block content
            if (contentRef.current.innerHTML !== block.content) {
                contentRef.current.innerHTML = block.content || '';
            }
        }
    }, []);

    // Sync focus and maintain cursor position
    useEffect(() => {
        if (isFocused && contentRef.current && document.activeElement !== contentRef.current) {
            contentRef.current.focus();
            // Move cursor to end if no selection exists
            const selection = window.getSelection();
            if (selection && selection.rangeCount === 0) {
                const range = document.createRange();
                range.selectNodeContents(contentRef.current);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, [isFocused]);

    // Sync content when block changes from external source (like undo/redo)
    useEffect(() => {
        if (contentRef.current) {
            const isCurrentlyFocused = document.activeElement === contentRef.current;

            // Only update if not currently focused to avoid interfering with typing
            if (!isCurrentlyFocused && contentRef.current.innerHTML !== block.content) {
                const cursorPosition = isCurrentlyFocused ? getCursorPosition(contentRef.current) : null;
                contentRef.current.innerHTML = block.content || '';
                if (cursorPosition !== null && isCurrentlyFocused) {
                    setCursorPosition(contentRef.current, cursorPosition);
                }
            }
        }
    }, [block.content]);

    // Helper functions for cursor management
    const getCursorPosition = (element: HTMLElement): number => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            return preCaretRange.toString().length;
        }
        return 0;
    };

    const setCursorPosition = (element: HTMLElement, position: number) => {
        const selection = window.getSelection();
        const range = document.createRange();
        let charCount = 0;
        let nodeStack: Node[] = [element];
        let node: Node | undefined;
        let foundStart = false;

        while (!foundStart && (node = nodeStack.pop())) {
            if (node.nodeType === Node.TEXT_NODE) {
                const nextCharCount = charCount + (node.textContent?.length || 0);
                if (position <= nextCharCount) {
                    range.setStart(node, position - charCount);
                    range.collapse(true);
                    foundStart = true;
                }
                charCount = nextCharCount;
            } else {
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i] as Node);
                }
            }
        }

        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLElement>) => {
        const newContent = e.currentTarget.innerHTML;
        updateBlock(block.id, newContent);

        // Check if user just typed "/" to trigger slash menu
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const textBeforeCursor = range.startContainer.textContent?.substring(0, range.startOffset) || '';
            if (textBeforeCursor.endsWith('/')) {
                // Small timeout to let the "/" render first
                setTimeout(() => {
                    openSlashMenu(block.id);
                }, 0);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === '/') {
            openSlashMenu(block.id);
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            // Get cursor position and split content
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0 && contentRef.current) {
                const range = selection.getRangeAt(0);

                // Clone the range to get content after cursor
                const afterRange = range.cloneRange();
                afterRange.selectNodeContents(contentRef.current);
                afterRange.setStart(range.endContainer, range.endOffset);

                // Get the HTML content after cursor
                const tempDiv = document.createElement('div');
                tempDiv.appendChild(afterRange.cloneContents());
                const afterContent = tempDiv.innerHTML;

                // Get content before cursor
                const beforeRange = range.cloneRange();
                beforeRange.selectNodeContents(contentRef.current);
                beforeRange.setEnd(range.startContainer, range.startOffset);
                const tempDiv2 = document.createElement('div');
                tempDiv2.appendChild(beforeRange.cloneContents());
                const beforeContent = tempDiv2.innerHTML;

                // Update current block with content before cursor
                updateBlock(block.id, beforeContent);

                // Create new block with content after cursor
                addBlock(block.id, afterContent);
            } else {
                // Fallback if no selection
                addBlock(block.id);
            }
        }
        if (e.key === 'Backspace' && !contentRef.current?.textContent) {
            e.preventDefault();
            deleteBlock(block.id);
        }
        onKeyDown(e, block.id);
    };

    // Render different tags based on type
    const Tag = block.type === 'h1' ? 'h1' :
        block.type === 'h2' ? 'h2' :
            block.type === 'h3' ? 'h3' :
                block.type === 'bullet' ? 'li' :
                    block.type === 'number' ? 'li' :
                        block.type === 'code' ? 'pre' :
                            block.type === 'table' ? 'div' :
                                'div'; // Default for text

    const styles: React.CSSProperties = {
        outline: 'none',
        padding: '4px 0',
        minHeight: '24px',
        position: 'relative',
        ...((block.type === 'code') ? {
            background: '#f4f4f4',
            padding: '12px',
            borderRadius: '4px',
            fontFamily: 'monospace'
        } : {}),
        ...((block.type === 'h1') ? { fontSize: '2em', fontWeight: 'bold', marginTop: '0.67em', marginBottom: '0.67em' } : {}),
        ...((block.type === 'h2') ? { fontSize: '1.5em', fontWeight: 'bold', marginTop: '0.83em', marginBottom: '0.83em' } : {}),
        ...((block.type === 'h3') ? { fontSize: '1.17em', fontWeight: 'bold', marginTop: '1em', marginBottom: '1em' } : {}),
    };

    const placeholder = block.type === 'text' && !block.content ? 'Type / for commands' :
        block.type === 'h1' && !block.content ? 'Heading 1' : '';

    // Special rendering for table
    if (block.type === 'table') {
        return <TableBlock blockId={block.id} updateBlock={updateBlock} />;
    }

    return (
        <div className={classNames('block-wrapper', block.type)} style={{ position: 'relative' }}>
            {block.type === 'bullet' && <span style={{ marginRight: 8 }}>•</span>}
            {block.type === 'number' && <span style={{ marginRight: 8 }}>1.</span>} {/* Simplified number */}

            <Tag
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={contentRef as any}
                contentEditable
                suppressContentEditableWarning
                suppressHydrationWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => onFocus(block.id)}
                style={styles}
                data-placeholder={placeholder}
                spellCheck={true}
            />

            {/* Placeholder CSS logic would be needed here or in global CSS */}
            <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #ccc;
          pointer-events: none;
          display: block; /* For Firefox */
        }
        .block-wrapper {
          display: flex;
          align-items: flex-start;
        }
        .block-wrapper.bullet, .block-wrapper.number {
          margin-left: 20px;
        }
      `}</style>
        </div>
    );
};

export default BlockComponent;
