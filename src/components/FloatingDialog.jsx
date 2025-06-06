import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

export default function FloatingDialog({ position = [0, 0, 0], texts = "", t = "l", extra = "no" }) {
  const [displayedText, setDisplayedText] = useState('');

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

  // Inject responsive styles into document head
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .dialog-box {
        min-width: 250px;
        min-height: 100px;
        max-width: 90vw;
        padding: 30px;
        background-color: rgba(241, 232, 232, 0.3);
        border: 1px solid black;
        color: black;
        font-family: monospace, monospace;
        font-weight: bold;
        font-size: 12px;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        text-align: center;
        user-select: none;
        white-space: pre-wrap;
        position: relative;
        filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.7));
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }

      @media (max-width: 768px) and (orientation: landscape) {
        .dialog-box {
          transform: scale(0.5);
          font-size: 8px;
          padding: 6px;
        }
      }

      @media (max-width: 480px) and (orientation: landscape) {
        .dialog-box {
          transform: scale(0.4);
          font-size: 6px;
          padding: 4px;
        }
      }

      @media (max-height: 600px) and (orientation: portrait) {
        .dialog-box {
          min-height: 80px;
          font-size: 11px;
          padding: 9px;
        }
      }

      @media (max-height: 400px) {
        .dialog-box {
          min-height: 50px;
          font-size: 9px;
          padding: 5px;
        }
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Bubble scale calculation
  const getScaleFactor = () => {
    const isLandscape = window.innerWidth > window.innerHeight;
    if (window.innerWidth <= 480 && isLandscape) return 0.4;
    if (window.innerWidth <= 768 && isLandscape) return 0.5;
    if (window.innerHeight <= 600) return 0.8;
    return 1;
  };

  const scale = getScaleFactor();

  const scaleBubbles = (bubbles) =>
    bubbles.map(b => ({
      width: b.width * scale,
      height: b.height * scale,
      bottom: b.bottom * scale,
      offset: b.offset,
    }));

  const isLeft = t === 'l';

  const baseBubbles = scaleBubbles([
    { width: 20, height: 20, bottom: -15, offset: '10%' },
    { width: 15, height: 15, bottom: -35, offset: '5%' },
  ]);

  const extraBubbles = scaleBubbles([
    { width: 12, height: 12, bottom: -49, offset: '-3%' },
    { width: 10, height: 10, bottom: -48, offset: '-13%' },
    { width: 8, height: 8, bottom: -38, offset: '-22%' },
  ]);

  const bubbleTailStyleBase = {
    content: '""',
    position: 'absolute',
    backgroundColor: 'rgba(147, 138, 138, 0.3)',
    border: "1px solid black",
    borderRadius: '50%',
    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
  };

  const renderBubbles = (bubbles) =>
    bubbles.map((b, i) => (
      <div
        key={i}
        style={{
          ...bubbleTailStyleBase,
          width: `${b.width}px`,
          height: `${b.height}px`,
          bottom: `${b.bottom}px`,
          [isLeft ? 'left' : 'right']: b.offset,
        }}
      />
    ));

  return (
    <group position={position}>
      <Html center>
        <div className="dialog-box">
          {displayedText}
          {renderBubbles(baseBubbles)}
          {extra === 'yes' && renderBubbles(extraBubbles)}
        </div>
      </Html>
    </group>
  );
}
