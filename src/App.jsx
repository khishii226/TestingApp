import React, { useEffect, useState } from 'react';
import './App.css';
import PortalViewer from './components/PortalViewer';
import Ind from './components/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundMusic from "./components/BackgroundMusic";

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

function App() {
  return (
    <Router>
      <BackgroundMusic />
      <OrientationLock />

      <Routes>
        <Route path="/" element={<PortalViewer />} />
        <Route path="/main" element={<Ind />} />
      </Routes>
    </Router>
  );
}

export default App;