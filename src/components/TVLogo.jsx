import React, { useEffect } from 'react';
import { Html } from '@react-three/drei';

export default function TVLogo() {

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .tv-logo {
        width: 120px;
        height: auto;
      }

      @media (max-width: 1024px) {
        .tv-logo {
          width: 100px;
        }
      }

      @media (max-width: 768px) {
        .tv-logo {
          width: 80px;
        }
      }

      @media (max-width: 480px) {
        .tv-logo {
          width: 60px;
        }
      }

      @media (orientation: landscape) and (max-height: 500px) {
        .tv-logo {
          width: 50px;
        }
      }

      @media (orientation: landscape) and (max-height: 400px) {
        .tv-logo {
          width: 45px;
        }
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  return (
    <group position={[-1.527, 0.253, 0.7]}>
      <Html center>
        <img src="./logo.png" alt="logo" className="tv-logo" />
      </Html>
    </group>
  );
}
