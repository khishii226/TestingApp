// PortalViewer.jsx
import React, { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { shaderMaterial, Sparkles, OrbitControls, useGLTF, Center, Preload } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import portalVertexShader from '../shaders/portal/vertex.js';
import portalFragmentShader from '../shaders/portal/fragment.js';
import Ghost from './Ghost.jsx';
import Logo from './Logo'

// Define custom shader material
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#00008b'),
    uColorEnd: new THREE.Color('#000000'),
  },
  portalVertexShader,
  portalFragmentShader
);

extend({ PortalMaterial });

function PortalModel({ onPortalClick, enabled }) {
  const { scene } = useGLTF('/portal.glb');
  const portalMaterialRef = useRef();
  const { gl, camera } = useThree();
  const [scale, setScale] = useState(0.5);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      setScale(width <= 500 ? 0.3 : 0.5);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const portalSurface = scene.getObjectByName('Path');

    if (portalSurface && portalMaterialRef.current) {
      portalMaterialRef.current.side = THREE.DoubleSide;
      portalMaterialRef.current.needsUpdate = true;
      portalSurface.material = portalMaterialRef.current;

      const handleClick = (event) => {
        const mouse = new THREE.Vector2(
          (event.clientX / gl.domElement.clientWidth) * 2 - 1,
          -(event.clientY / gl.domElement.clientHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(portalSurface, true);

        if (intersects.length > 0) {
          if (enabled) {
            onPortalClick();
          }
        }
      };

      gl.domElement.addEventListener('click', handleClick);
      return () => gl.domElement.removeEventListener('click', handleClick);
    }
  }, [scene, gl, camera, onPortalClick, enabled]);

  useFrame((state) => {
    if (portalMaterialRef.current) {
      portalMaterialRef.current.uTime = state.clock.getElapsedTime();
    }
  });

  return (
    <Center center position={[0, 0, 0]} scale={scale}>
      <primitive object={scene} />
      <portalMaterial ref={portalMaterialRef} />
    </Center>
  );
}

function CameraZoom({ zooming }) {
  const { camera } = useThree();
  const targetPosition = new THREE.Vector3(0, 1.5, 0);
  const lookAtTarget = new THREE.Vector3(0, 1.5, 0); // can also lerp this if needed

  const positionRef = useRef(camera.position.clone());
  const lookAtRef = useRef(lookAtTarget.clone());

  useFrame(() => {
    if (zooming) {
      // Smoothly interpolate position
      positionRef.current.lerp(targetPosition, 0.02);
      camera.position.copy(positionRef.current);

      // Smoothly interpolate lookAt target (optional)
      lookAtRef.current.lerp(lookAtTarget, 0.02);
      camera.lookAt(lookAtRef.current);
    }
  });

  return null;
}


export default function PortalViewer() {
  const navigate = useNavigate();

  const [fading, setFading] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [ghostEntered, setGhostEntered] = useState(false);
  const [startGhostAnimation, setStartGhostAnimation] = useState(false); // NEW

  // Called when portal is clicked
  const handlePortalClick = () => {
    if (ghostEntered) return; // Already entered, ignore further clicks
    // Trigger ghost animation start
    setStartGhostAnimation(true);
  };

  // Called by Ghost when it finishes fading into portal
  const handleGhostEnterPortal = () => {
    setGhostEntered(true);
    setStartGhostAnimation(false);

    // Start camera zoom and fading sequence after ghost entered
    setZooming(true);
    setTimeout(() => setFading(true), 2000);
    setTimeout(() => navigate('/main'), 3000);
  };

  return (
    <>
    <Logo/>
      <Canvas
       gl={{ antialias: true }} 
        style={{ height: '100vh', width: '100vw' }}
        camera={{ position: [0, 4, 12], fov: 45 }}
      
      >
        <color attach="background" args={['#12171f']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={6} />
        <directionalLight position={[0, 5, -5]} intensity={5} />
        <pointLight position={[0, 1.5, 0]} intensity={10} color={'#00008b'} />
        
        <Suspense fallback={null}>
          <PortalModel onPortalClick={handlePortalClick} enabled={!startGhostAnimation && !ghostEntered} />
          <CameraZoom zooming={zooming} />
          <Sparkles size={5} scale={[16, 12, 16]} position-y={1} speed={0.5} count={300} />
          <Ghost
            onEnterPortal={handleGhostEnterPortal}
            startAnimation={startGhostAnimation} 
          />
        </Suspense>

        <OrbitControls maxDistance={14} minDistance={4} enablePan={false}/>
      </Canvas>

      {/* Fade-out overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          pointerEvents: 'none',
          opacity: fading ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 10,
        }}
      />
    </>
  );
}
