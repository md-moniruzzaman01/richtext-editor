"use client"
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TableBlockProps {
    blockId: string;
    updateBlock: (id: string, content: string) => void;
}

const TableBlock: React.FC<TableBlockProps> = ({ blockId, updateBlock }) => {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [tableData, setTableData] = useState<string[][]>(
        Array(3).fill(null).map(() => Array(3).fill(''))
    );

    const addRow = () => {
        const newData = [...tableData, Array(cols).fill('')];
        setTableData(newData);
        setRows(rows + 1);
    };

    const addColumn = () => {
        const newData = tableData.map(row => [...row, '']);
        setTableData(newData);
        setCols(cols + 1);
    };

    const deleteRow = (rowIndex: number) => {
        if (rows > 1) {
            const newData = tableData.filter((_, i) => i !== rowIndex);
            setTableData(newData);
            setRows(rows - 1);
        }
    };

    const deleteColumn = (colIndex: number) => {
        if (cols > 1) {
            const newData = tableData.map(row => row.filter((_, i) => i !== colIndex));
            setTableData(newData);
            setCols(cols - 1);
        }
    };

    const updateCell = (rowIndex: number, colIndex: number, content: string) => {
        const newData = tableData.map((row, ri) =>
            row.map((cell, ci) => (ri === rowIndex && ci === colIndex ? content : cell))
        );
        setTableData(newData);
    };

    return (
        <div style={{ margin: '16px 0', position: 'relative' }}>
            {/* Table Controls */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '8px',
                padding: '4px',
                background: '#f5f5f5',
                borderRadius: '4px'
            }}>
                <button
                    onClick={addRow}
                    style={{
                        background: 'white',
                        border: '1px solid #ddd',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <Plus size={14} /> Add Row
                </button>
                <button
                    onClick={addColumn}
                    style={{
                        background: 'white',
                        border: '1px solid #ddd',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <Plus size={14} /> Add Column
                </button>
            </div>

            {/* Table */}
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #ddd'
            }}>
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ position: 'relative' }}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        minWidth: '100px',
                                        minHeight: '40px',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Cell delete buttons */}
                                    {rowIndex === 0 && (
                                        <button
                                            onClick={() => deleteColumn(colIndex)}
                                            style={{
                                                position: 'absolute',
                                                top: '-20px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                background: '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                padding: '2px 4px',
                                                cursor: 'pointer',
                                                fontSize: '10px',
                                                display: 'none'
                                            }}
                                            className="delete-col-btn"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    )}
                                    {colIndex === 0 && (
                                        <button
                                            onClick={() => deleteRow(rowIndex)}
                                            style={{
                                                position: 'absolute',
                                                left: '-20px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                padding: '2px 4px',
                                                cursor: 'pointer',
                                                fontSize: '10px',
                                                display: 'none'
                                            }}
                                            className="delete-row-btn"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    )}
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        style={{ outline: 'none', minHeight: '20px' }}
                                        onInput={(e) => {
                                            updateCell(rowIndex, colIndex, e.currentTarget.textContent || '');
                                        }}
                                    >
                                        {cell}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
        td:hover .delete-col-btn,
        td:hover .delete-row-btn {
          display: block !important;
        }
      `}</style>
        </div>
    );
};

export default TableBlock;
