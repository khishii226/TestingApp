import React, { useEffect, useState } from 'react';
import './App.css';
import PortalViewer from './components/PortalViewer';
import Ind from './components/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundMusic from "./components/BackgroundMusic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt, faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons';

// 🔒 Orientation lock
function OrientationLock() {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  const checkOrientation = () => {
    setIsLandscape(window.innerWidth > window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isLandscape) {
    return (
      <div style={{
        position: 'fixed',
        zIndex: 9999,
        background: '#000',
        color: '#fff',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        textAlign: 'center',
        padding: '20px'
      }}>
        Please rotate your device to landscape mode to continue.
      </div>
    );
  }

  return null;
}

// ⬆ Fullscreen handler with exit button
function FullscreenHandler() {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      style={{
        position: 'fixed',
        top: "15%",
        left: "3%",
        color: 'white',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        backgroundColor: 'transparent',
        border: 'none',
        padding: '10px 10px',
        cursor: 'pointer',
        fontSize: '1rem',
      }}
    >
      {/* {isFullscreen ? '🔽' : '🔼'} */}
      {/* {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} */}

      <FontAwesomeIcon icon={isFullscreen ? faCompressArrowsAlt : faExpandArrowsAlt} size="lg" />
    </button>
  );
}


function App() {
  return (
    <Router>
      <BackgroundMusic />
      <OrientationLock />
      <FullscreenHandler />
      <Routes>
        <Route path="/" element={<PortalViewer />} />
        <Route path="/main" element={<Ind />} />
      </Routes>
    </Router>
  );
}

export default App;
