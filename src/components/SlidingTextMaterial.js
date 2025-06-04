import { useMemo } from 'react';
import * as THREE from 'three';

export function useSlidingTextTexture(
  text = 'GHARSEE offers a one-of-a-kind shopping experience — immersive, efficient, eco-smart, and right at your fingertips.   ',
  speed = 0.5 // kept for compatibility, unused here
) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1000;

    const ctx = c.getContext('2d');

    const fontSize = 70;
    const lineHeight = fontSize * 1.3;
    const padding = 300;
    const maxTextWidth = c.width - padding * 2;

    ctx.font = `bold ${fontSize}px "Courier New", monospace`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFFFFF';

    // Word-wrapping logic
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Draw each line
    lines.forEach((l, i) => {
      ctx.fillText(l, padding, padding + i * lineHeight);
    });

    return c;
  }, [text]);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.rotation = Math.PI;
    tex.center.set(0.5, 0.5);
    tex.repeat.x = -1;
    return tex;
  }, [canvas]);

  return texture;
}
