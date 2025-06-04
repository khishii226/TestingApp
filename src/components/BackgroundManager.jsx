import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function BackgroundManager({ isDay }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    const color = new THREE.Color(isDay ? '#87CEEB' : '#0d1b2a');
    scene.background = color;
    gl.setClearColor(color, 1);
  }, [isDay, scene, gl]);

  return null;
}
