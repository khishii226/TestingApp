import React, { useMemo, useCallback, useEffect, useState } from "react";

const exitTargets = {
  "-1.62,0.4,1.3": {
    position: [-1.2, 0.4, 2.2],
    lookAt: [-1.6, 0.4, 1.5],
  },
  "-1.4,0.3,0.9": {
    position: [-1.2, 0.4, 2.2],
    lookAt: [-1.6, 0.4, 1.5],
  },
  "1.9,0.35,-0.5": {
    position: [0.72, 0.4, -0.4],
    lookAt: [1.9, 0.5, -0.65],
  },
};

const BackBtn = ({ currentMarkerPos, setCurrentTarget }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsSmallScreen(window.innerWidth < 480);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const markerKey = useMemo(() => currentMarkerPos?.join(","), [currentMarkerPos]);
  const target = useMemo(() => exitTargets[markerKey], [markerKey]);

  const handleClick = useCallback(() => {
    const a = new Audio("/click.mp3");
    a.volume = 0.05;
    a.play();
    if (target) setCurrentTarget(target);
  }, [target, setCurrentTarget]);

  if (!target) return null;

  return (
    <button
      aria-label="Exit"
      onClick={handleClick}
      tabIndex={0}
      style={{
        position: 'absolute',
        zIndex: 1000,
        top: '12vh',
        right: '2vw',
        padding: '0.5em 1em',
        background: 'transparent',
        cursor: 'pointer',
        color: 'white',
        fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
        fontWeight: 'bold',
        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        touchAction: 'manipulation',
        transition: 'transform 0.2s ease',
        border: '1px solid white',
        borderRadius: '30px',
      }}
    >
      {isSmallScreen ? 'Exit' : 'Exit'}
    </button>
  );
};

export default BackBtn;
