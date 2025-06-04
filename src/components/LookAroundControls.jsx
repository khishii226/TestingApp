import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LookAroundControls({
  enabled = true,
  sensitivity = 0.002,
  maxPitch = Math.PI / 2 - 0.01,
  minPitch = -Math.PI / 2 + 0.01,
  keySensitivity = 0.02,
  restrictYaw = false,
}) {
  const { camera } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);
  const initialYaw = useRef(null);
  const initialPitch = useRef(null);
  const isDragging = useRef(false);
  const didMove = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const pressedKeys = useRef({});
  const activeTouchId = useRef(null);

  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  useEffect(() => {
    if (!enabled) return;
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    pitch.current = euler.x;
    yaw.current = euler.y;
    targetPitch.current = pitch.current;
    targetYaw.current = yaw.current;
    initialYaw.current = yaw.current;
    initialPitch.current = pitch.current;
  }, [enabled, camera]);

  useEffect(() => {
    if (!enabled) return;

    const onMouseDown = (e) => {
      isDragging.current = true;
      didMove.current = false;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;

      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        didMove.current = true;

        targetYaw.current -= deltaX * sensitivity;

        if (restrictYaw && initialPitch.current !== null) {
          targetPitch.current = initialPitch.current;
        } else {
          targetPitch.current -= deltaY * sensitivity;
          targetPitch.current = Math.max(minPitch, Math.min(maxPitch, targetPitch.current));
        }

        if (restrictYaw && initialYaw.current !== null) {
          const maxYawDelta = THREE.MathUtils.degToRad(55);
          const deltaYaw = targetYaw.current - initialYaw.current;
          if (deltaYaw > maxYawDelta) targetYaw.current = initialYaw.current + maxYawDelta;
          else if (deltaYaw < -maxYawDelta) targetYaw.current = initialYaw.current - maxYawDelta;
        }

        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        activeTouchId.current = touch.identifier;
        isDragging.current = true;
        didMove.current = false;
        lastPos.current = { x: touch.clientX, y: touch.clientY };
      }
    };
    const onTouchMove = (e) => {
  if (!isDragging.current || activeTouchId.current === null) return;

  const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId.current);
  if (!touch) return;

  const deltaX = touch.clientX - lastPos.current.x;
  const deltaY = touch.clientY - lastPos.current.y;

  if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
    e.preventDefault(); // Only block scroll when dragging

    didMove.current = true;

    const touchSensitivityMultiplier = 0.5;
    targetYaw.current -= deltaX * sensitivity * touchSensitivityMultiplier;

    // ✅ Allow pitch changes on touch with custom ±60° limit
    if (restrictYaw && initialPitch.current !== null) {
      targetPitch.current = initialPitch.current;
    } else {
      targetPitch.current -= deltaY * sensitivity * touchSensitivityMultiplier;

      // Use ±60° clamp for touch only
      targetPitch.current = Math.max(minPitch, Math.min(maxPitch, targetPitch.current));
    }

    if (restrictYaw && initialYaw.current !== null) {
      const maxYawDelta = THREE.MathUtils.degToRad(60);
      const deltaYaw = targetYaw.current - initialYaw.current;
      if (deltaYaw > maxYawDelta) targetYaw.current = initialYaw.current + maxYawDelta;
      else if (deltaYaw < -maxYawDelta) targetYaw.current = initialYaw.current - maxYawDelta;
    }

    lastPos.current = { x: touch.clientX, y: touch.clientY };
  }
};


    const onTouchEnd = (e) => {
      const endedTouch = Array.from(e.changedTouches).find(
        (t) => t.identifier === activeTouchId.current
      );
      if (endedTouch) {
        isDragging.current = false;
        activeTouchId.current = null;
      }
    };

    const onKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        pressedKeys.current[e.key.toLowerCase()] = true;
        didMove.current = true;
      }
    };

    const onKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        pressedKeys.current[e.key.toLowerCase()] = false;
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled, sensitivity, maxPitch, minPitch, restrictYaw]);

 useFrame(() => {
  if (!enabled) return;

  if (pressedKeys.current['arrowleft'] || pressedKeys.current['a']) {
    targetYaw.current += keySensitivity;
    didMove.current = true;
  }
  if (pressedKeys.current['arrowright'] || pressedKeys.current['d']) {
    targetYaw.current -= keySensitivity;
    didMove.current = true;
  }

  // ✅ Remove device check — pitch should update regardless
  if (!restrictYaw) {
    if (pressedKeys.current['arrowdown'] || pressedKeys.current['s']) {
      targetPitch.current -= keySensitivity;
      didMove.current = true;
    }
    if (pressedKeys.current['arrowup'] || pressedKeys.current['w']) {
      targetPitch.current += keySensitivity;
      didMove.current = true;
    }
    targetPitch.current = Math.max(minPitch, Math.min(maxPitch, targetPitch.current));
  }

  if (restrictYaw && initialYaw.current !== null) {
    const maxYawDelta = THREE.MathUtils.degToRad(55);
    const deltaYaw = targetYaw.current - initialYaw.current;
    if (deltaYaw > maxYawDelta) targetYaw.current = initialYaw.current + maxYawDelta;
    else if (deltaYaw < -maxYawDelta) targetYaw.current = initialYaw.current - maxYawDelta;
  }

  if (!didMove.current) return;

  yaw.current += (targetYaw.current - yaw.current) * 0.1;
  pitch.current += (targetPitch.current - pitch.current) * 0.1;

  const quaternion = new THREE.Quaternion();
  quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ'));
  camera.quaternion.copy(quaternion);
});

  return null;
}
