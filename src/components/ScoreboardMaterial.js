import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function useSlidingScoreboardTexture(
  speed = 5 // seconds per number, must be > 0
) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    return c;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [canvas]);

  useFrame(({ clock }) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(1, -1);
    ctx.translate(0, -canvas.height);

    // Font setup
    const fontSize = 400;
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Defensive: ensure speed is positive and non-zero
    const safeSpeed = speed > 0 ? speed : 1;

    // Get elapsed time, default to 0 if undefined
    const elapsed = clock?.getElapsedTime() || 0;

    // Compute phase, modulo 3 for 3,2,1 cycle
    const phase = Math.floor(elapsed / safeSpeed) % 3;

    // Map phase 0 -> 3, 1 -> 2, 2 -> 1
    const digit = 3 - phase;

    ctx.fillStyle = '#FF0000'; // bright red
    ctx.fillText(digit.toString(), canvas.width / 2, canvas.height / 2);

    ctx.restore();

    texture.needsUpdate = true;
  });

  return texture;
}
