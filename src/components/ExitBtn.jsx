import { useEffect, useState } from 'react';

export default function ExitBtn({ onClick }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 480);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const style = {
    position: 'absolute',
    top: '2.5vh',
    right: '2vw',
    zIndex: 1000,
    padding: '0.5em 1em',
    background: 'transparent',
    border: '1px solid white',
    borderRadius: '30px',
    cursor: 'pointer',
    color: 'white',
    fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
    fontWeight: 'bold',
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    touchAction: 'manipulation',
    transition: 'transform 0.2s ease',
  };

  return (
    <button
      style={style}
      onClick={onClick}
      onPointerOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onPointerOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
    >
      {isSmallScreen ? 'Tower' : 'Back to Tower'}
    </button>
  );
}
