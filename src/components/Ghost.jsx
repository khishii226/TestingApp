import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Ghost({ onEnterPortal, startAnimation = false }) {
  const ghostRef = useRef();
  const initialYRef = useRef(null);
  const calledPortalEnterRef = useRef(false);
  const { scene, animations } = useGLTF('/wi2.glb');
  const { actions } = useAnimations(animations, ghostRef);

  const [start, setStart] = useState(false);
  const [stage, setStage] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Screen size check
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    const handleMediaChange = (e) => setIsSmallScreen(e.matches);
    setIsSmallScreen(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const scale = isSmallScreen ? [0.1, 0.1, 0.1] : [0.23, 0.23, 0.23];
  const position = isSmallScreen ? [-0.7, 0.5, 0.5] : [-1.2, 1.1, 0.5];

  useEffect(() => {
    initialYRef.current = position[1];
  }, [position]);

  useEffect(() => {
    let icosphereMesh = null;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = false;
        child.material.opacity = 1;
        child.material.depthWrite = true;

        if (child.name === 'Icosphere') {
          icosphereMesh = child;
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x023e8a),
            transparent:true
          });
        }
      }
    });

    scene.userData.icosphereMesh = icosphereMesh;

    Object.values(actions).forEach((action) => {
      action.reset();
    action.timeScale = 0.2; // Slow down 
    action.fadeIn(0.5).play();
    });

    const timeout = setTimeout(() => setStart(true), 1000);
    return () => clearTimeout(timeout);
  }, [scene, actions]);

  useFrame((_, delta) => {
    if (!start || !ghostRef.current) return;

    const ghost = ghostRef.current;
    const rotateSpeed = isSmallScreen ? Math.PI * 0.3 : Math.PI * 0.5;
    const moveSpeed = isSmallScreen ? 0.3 : 0.5;
    const fastRotateSpeed = isSmallScreen ? Math.PI : Math.PI * 2;
    const targetY = initialYRef.current ?? 1.3;

    if (!startAnimation) {
      ghost.position.set(...position);
      ghost.rotation.set(0, 0, 0);
      setStage(0);
      calledPortalEnterRef.current = false;
      return;
    }

    // Animation stages
    if (stage === 0) {
      ghost.rotation.y += delta * rotateSpeed;
      if (ghost.rotation.y >= Math.PI / 2) {
        ghost.rotation.y = Math.PI / 2;
        setStage(1);
      }
    } else if (stage === 1) {
      ghost.position.x += delta * moveSpeed;
      if (ghost.position.x >= 0) {
        ghost.position.x = 0;
        setStage(2);
      }
    } else if (stage === 2) {
      ghost.position.y += delta * moveSpeed;
      if (ghost.position.y >= targetY) {
        ghost.position.y = targetY;
        setStage(3);
      }
    } else if (stage === 3) {
      ghost.rotation.y += delta * fastRotateSpeed;
      if (ghost.rotation.y >= Math.PI) {
        ghost.rotation.y = Math.PI;
        setStage(4);
      }
    } else if (stage === 4) {
      ghost.position.z = THREE.MathUtils.lerp(ghost.position.z, 0, delta * 6);
      if (Math.abs(ghost.position.z) < 0.01) {
        ghost.position.z = 0;
        setStage(5);
      }
    } else if (stage === 5) {
      let allTransparent = true;
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = Math.max(child.material.opacity - delta * 3.5, 0);
          if (child.material.opacity > 0) {
            allTransparent = false;
          }
        }
      });
      if (allTransparent) setStage(6);
    }

    if (stage === 6 && !calledPortalEnterRef.current) {
      calledPortalEnterRef.current = true;
      if (onEnterPortal) onEnterPortal();
    }

    const icosphere = scene.userData.icosphereMesh;
    if (icosphere?.material) {
      const time = performance.now() * 0.002;
      icosphere.material.emissiveIntensity = 1.8 + Math.sin(time * 5) * 0.4;
    }
  });

  return <primitive object={scene} ref={ghostRef} position={position} scale={scale} />;
}


