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

  // Responsive styles
  useEffect(() => {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .dialog-box {
      width: 280px;
      height: 110px;
      padding: 15px;
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

    @media (max-width: 1024px) {
      .dialog-box {
        width: 260px;
        height: 100px;
        font-size: 11px;
      }
    }

    @media (max-width: 768px) {
      .dialog-box {
        width: 220px;
        height: 90px;
        font-size: 10px;
      }
    }

    @media (max-width: 480px) {
      .dialog-box {
        width: 190px;
        height: 80px;
        font-size: 9px;
      }
    }

    @media (orientation: landscape) and (max-height: 400px) {
      .dialog-box {
        width: 160px;
        height: 65px;
        font-size: 7.5px;
        padding: 10px;
      }
    }

    @media (orientation: landscape) and (max-height: 350px) {
      .dialog-box {
        width: 140px;
        height: 60px;
        font-size: 7px;
        padding: 8px;
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
