import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

export default function HouseContent({ position = [0, 0, 0], texts = "", tc = "" }) {
  const [displayedText, setDisplayedText] = useState('');

  // Typing animation
  useEffect(() => {
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length >= texts.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + texts.charAt(prev.length);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [texts]);

  // Responsive font size and width
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .dialog-box {
        width: 300px;
        height: 120px;
        padding: 20px;
        background-color: transparent;
        color: white;
        font-size: 12px;
        text-align: center;
        user-select: none;
        white-space: pre-wrap;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: 768px) {
        .dialog-box {
          font-size: 10px;
          width: 260px;
        }
      }

      @media (max-width: 480px) {
        .dialog-box {
          font-size: 9px;
          width: 230px;
        }
      }

      @media (orientation: landscape) and (max-height: 500px) {
        .dialog-box {
          font-size: 8px;
          width: 200px;
        }
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  return (
    <group position={position}>
      <Html center>
        <div className="dialog-box" style={{ color: tc }}>{displayedText}</div>
      </Html>
    </group>
  );
}
