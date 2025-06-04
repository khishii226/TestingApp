import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CameraFlyTo({ target, onArrive }) {
  const { camera } = useThree();

  const startPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  const targetPosVec = useRef(new THREE.Vector3());
  const lookAtVec = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!target?.targetPos || !target?.lookAt) return;

    startPos.current.copy(camera.position);
    currentPos.current.copy(camera.position);
    currentLookAt.current.copy(new THREE.Vector3().copy(camera.getWorldDirection(new THREE.Vector3())).add(camera.position));

    targetPosVec.current.set(...target.targetPos);
    lookAtVec.current.set(...target.lookAt);
  }, [target]);

  useFrame(() => {
    if (!target) return;

    // Smoothly move position
    currentPos.current.lerp(targetPosVec.current, 0.08);
    camera.position.copy(currentPos.current);

    // Smoothly rotate camera
    currentLookAt.current.lerp(lookAtVec.current, 0.1);
    camera.lookAt(currentLookAt.current);

    // Check if camera is near target
    if (currentPos.current.distanceTo(targetPosVec.current) < 0.05) {
      onArrive?.();
    }
  });

  return null;
}
