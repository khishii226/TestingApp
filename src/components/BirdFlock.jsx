import { useState, useEffect } from 'react';
import Bird from './Bird';

export default function BirdFlock() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const adjustRadius = (baseRadius) => {
    if (windowWidth <= 400) return baseRadius * 0.5;
    if (windowWidth <= 500) return baseRadius * 0.65;
    if (windowWidth <= 730) return baseRadius * 0.8;
    return baseRadius;
  };

  const adjustScale = (baseScale) => {
    if (windowWidth <= 400) return baseScale * 0.5;
    if (windowWidth <= 500) return baseScale * 0.65;
    if (windowWidth <= 730) return baseScale * 0.8;
    return baseScale;
  };

  return (
    <>
      {[1, -1].map((direction) =>
        [5, 4, 3, 4.5, 3.5].map((baseRadius, i) => {
          const radius = adjustRadius(baseRadius);
          const baseScale = baseRadius === 4 || baseRadius === 3.5
            ? 0.012
            : 0.01 - (i > 2 ? 0.001 : 0);
          const scale = adjustScale(baseScale);

          return (
            <Bird
              key={`${direction}-${baseRadius}-${i}`}
              position={[
                0,
                direction === 1 ? (i < 3 ? 3 : 2.8) : (i < 3 ? 2.9 : 2.7),
                0,
              ]}
              radius={radius}
              speed={0.15}
              scale={scale}
              direction={direction}
            />
          );
        })
      )}
    </>
  );
}
