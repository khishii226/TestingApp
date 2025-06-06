import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

export default function HouseContent({ position = [0, 0, 0], texts = "" }) {
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

  // Inject fixed-size style
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .dialog-box {
        width: 300px;
        height: 120px;
        padding: 20px;
        background-color: transparent;
        color: white;
        font-family: 'Courier New', Courier, monospace;
        font-size: 14px;
        text-align: center;
        user-select: none;
        white-space: pre-wrap;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  return (
    <group position={position}>
      <Html center>
        <div className="dialog-box">{displayedText}</div>
      </Html>
    </group>
  );
}
