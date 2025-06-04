import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CameraMoveTo({ target, onArrive }) {
  const { camera } = useThree();

  const progress = useRef(0); // progress of camera movement (0 to 1)
  const hasArrived = useRef(false); // flag to trigger onArrive once

  const startPos = useRef(new THREE.Vector3());
  const targetPos = new THREE.Vector3(...target.targetPos);
  const targetLookAt = new THREE.Vector3(...target.lookAt);

  useEffect(() => {
    // Reset on new target
    progress.current = 0;
    hasArrived.current = false;

    // Save current camera position
    startPos.current.copy(camera.position);
  }, [target, camera]);

  useFrame((_, delta) => {
    if (progress.current < 1) {
      progress.current += delta * 1; // speed factor
      if (progress.current > 1) progress.current = 1;

      // Move camera toward the target position
      camera.position.lerpVectors(startPos.current, targetPos, progress.current);

      // Always look at the target lookAt point
      camera.lookAt(targetLookAt);

      if (progress.current === 1 && !hasArrived.current) {
        hasArrived.current = true;
        onArrive?.();
      }
    } else {
      // After arrival, keep looking at the targetLookAt
      camera.lookAt(targetLookAt);
    }
  });

  return null;
}
