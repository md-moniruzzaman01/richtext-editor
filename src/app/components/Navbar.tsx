"use client";

import { useState } from "react";
import { FileText, Clock, MessageSquare, Users, Lock } from "lucide-react";

const Navbar = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [documentTitle, setDocumentTitle] = useState("Untitled Document");

    const menuItems = [
        "File",
        "Edit",
        "View",
        "Insert",
        "Format",
        "Tools",
        "Extensions",
        "Help",
    ];

    return (
        <div
            style={{
                borderBottom: "1px solid #e0e0e0",
                background: "#f9f9f9",
            }}
        >
            {/* Top Bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    gap: "12px",
                    height: "64px",
                }}
            >
                {/* Logo */}
                <FileText size={24} color="#1a73e8" />

                {/* Title + Menu */}
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Editable Title */}
                    {isEditing ? (
                        <input
                            type="text"
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            autoFocus
                            className="title-input"
                        />
                    ) : (
                        <div className="title-text" onClick={() => setIsEditing(true)}>
                            {documentTitle}
                        </div>
                    )}

                    {/* Menu Bar */}
                    <div className="menu-bar">
                        {menuItems.map((item) => (
                            <button className="menu-btn" key={item}>
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button className="icon-btn" title="Last edit was seconds ago">
                        <Clock size={20} color="#5f6368" />
                    </button>
                    <button className="icon-btn" title="See comments">
                        <MessageSquare size={20} color="#5f6368" />
                    </button>
                    <button className="icon-btn" title="Join a call">
                        <Users size={20} color="#5f6368" />
                    </button>

                    {/* Share Button */}
                    <button className="share-btn">
                        <Lock size={16} />
                        Share
                    </button>
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
        .title-input {
          font-size: 18px;
          border: 1px solid #1a73e8;
          padding: 4px 8px;
          border-radius: 4px;
          outline: none;
          max-width: 400px;
        }

        .title-text {
          font-size: 18px;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .title-text:hover {
          background: #f0f0f0;
        }

        .menu-bar {
          display: flex;
          gap: 4px;
          margin-top: 4px;
        }

        .menu-btn {
          background: transparent;
          border: none;
          padding: 4px 8px;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
          color: #444;
          transition: background 0.15s ease;
        }

        .menu-btn:hover {
          background: #e8e8e8;
        }

        .icon-btn {
          background: transparent;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        .icon-btn:hover {
          background: #e8e8e8;
        }

        .share-btn {
          background: #1a73e8;
          color: white;
          border: none;
          padding: 8px 24px;
          border-radius: 24px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease;
        }
        .share-btn:hover {
          background: #1557b0;
        }
      `}</style>
        </div>
    );
};

export default Navbar;
