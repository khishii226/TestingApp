import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';

export default function SceneMarkerWithLine({ position, onClick }) {
  const glowRef = useRef();
  const shaderMaterialRef = useRef();
  const texture = useLoader(THREE.TextureLoader, '/radial-glow.png');
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const [x, y, z] = position;

  // Line geometry points from bottom (y=0) to top (y)
  const linePoints = useMemo(() => {
    return [new THREE.Vector3(x, 0, z), new THREE.Vector3(x, y, z)];
  }, [x, y, z]);

  // Geometry with normalized Y attribute for shader
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const positions = geo.attributes.position.array;
    const yCoords = [];
    for (let i = 0; i < positions.length; i += 3) {
      yCoords.push(positions[i + 1] / y); // normalize Y between 0 and 1
    }
    geo.setAttribute('aY', new THREE.Float32BufferAttribute(yCoords, 1));
    return geo;
  }, [linePoints, y]);

  // HSV to RGB conversion function for shader (GLSL)
  // We'll do HSV->RGB conversion inside fragment shader

  // Memoize shader material for pulse animation with rainbow color cycling
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float aY;
        varying float vY;
        void main() {
          vY = aY;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying float vY;

        // HSV to RGB
        vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp( abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0),
                                    6.0) - 3.0) - 1.0,
                           0.0,
                           1.0 );
          rgb = rgb*rgb*(3.0-2.0*rgb);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        float glowBand(float y, float offset) {
          float speed = 0.3;
          float t = mod(uTime * speed + offset, 1.0);
          return smoothstep(0.03, 0.0, abs(y - t));
        }

        void main() {
          float glow = 0.0;
          // sum of three glow bands spaced along the line
          glow += glowBand(vY, 0.0);
          glow += glowBand(vY, 0.33);
          glow += glowBand(vY, 0.66);

          // Hue cycles over time plus position to create rainbow moving effect
          float hue = mod(uTime * 0.3 + vY, 1.0);
          vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));

          gl_FragColor = vec4(color, glow);
        }
      `,
    });
  }, []);

  if (!shaderMaterialRef.current) {
    shaderMaterialRef.current = shaderMaterial;
  }

  // Helper to convert HSV to RGB (returns THREE.Color) for sprite color
  function hsvToRgb(h, s, v) {
    let r, g, b;

    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: (r = v), (g = t), (b = p); break;
      case 1: (r = q), (g = v), (b = p); break;
      case 2: (r = p), (g = v), (b = t); break;
      case 3: (r = p), (g = q), (b = v); break;
      case 4: (r = t), (g = p), (b = v); break;
      case 5: (r = v), (g = p), (b = q); break;
      default: (r = 1), (g = 1), (b = 1);
    }

    return new THREE.Color(r, g, b);
  }

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Animate glow sprite scale & opacity (smaller size)
    if (glowRef.current) {
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * 4);
      const scale = 0.1 + pulse * 0.015;
      glowRef.current.scale.set(scale, scale, scale);
      glowRef.current.material.opacity = 0.5 + pulse * 0.5;

      // Cycle through rainbow hues synced with pulse speed (speed = 0.3 in shader)
      const speed = 0.3;
      const hue = (elapsed * speed) % 1;
      const color = hsvToRgb(hue, 1, 1);
      glowRef.current.material.color.copy(color);
    }

    // Update time uniform for shader pulse animation
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <>
      {/* Glowing sprite */}
      <sprite
        ref={glowRef}
        position={[x, y, z]}
        onClick={() => onClick(position)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        frustumCulled={false}
        renderOrder={2}
      >
        <spriteMaterial
          map={texture}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
          transparent
        />
      </sprite>

      {/* Base low-opacity line */}
      <line geometry={geometry}>
        <lineBasicMaterial color="#eb77ee" transparent opacity={0.2} />
      </line>

      {/* Glowing pulses line with rainbow shader */}
      <line geometry={geometry} material={shaderMaterialRef.current} />
    </>
  );
}
