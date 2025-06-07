import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimationMixer, LoopRepeat, LoopOnce } from 'three';
import { useGLTF } from '@react-three/drei';

import { useSlidingTextTexture } from './SlidingTextMaterial';
import { useSlidingScoreboardTexture } from './ScoreboardMaterial';

import vertexShader from '../shaders/waterfall/water.vert?raw';
import fragmentShader from '../shaders/waterfall/water.frag?raw';

const createWaterMaterial = () =>
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.8 },
      uEnvironmentMap: { value: null },
      uWavesAmplitude: { value: 0.0015 },
      uWavesFrequency: { value: 1.7 },
      uWavesPersistence: { value: 0.3 },
      uWavesLacunarity: { value: 5.18 },
      uWavesIterations: { value: 8 },
      uWavesSpeed: { value: 0.4 },
      uTroughColor: { value: new THREE.Color('#89CFF0') },
      uSurfaceColor: { value: new THREE.Color('#7393B3') },
      uPeakColor: { value: new THREE.Color('#89CFF0') },
      uPeakThreshold: { value: 0.08 },
      uPeakTransition: { value: 0.05 },
      uTroughThreshold: { value: -0.01 },
      uTroughTransition: { value: 0.15 },
      uFresnelScale: { value: 0.8 },
      uFresnelPower: { value: 0.5 },
    },
  });

const rainbowColors = [
  new THREE.Color('#fcbd11'),
  new THREE.Color('#f26a50'),
  new THREE.Color('#ef4546'),
  new THREE.Color('#ea499a'),
  new THREE.Color('#4bba76'),
  new THREE.Color('#488dcb'),
  new THREE.Color('#474099'),
  new THREE.Color('#2a2f83'),
  new THREE.Color('#262263'),
];

function createRainbowShaderMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float uTime;
      uniform vec3 uColors[9];
      varying vec3 vPosition;

      void main() {
        float x = mod(vPosition.x - uTime, 9.0);
        int index = int(floor(x));
        int next = (index + 1) % 9;
        float t = fract(x);
        vec3 color = mix(uColors[index], uColors[next], t);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
      uColors: { value: rainbowColors },
    },
  });
}

const Island = forwardRef((props, ref) => {
  // Use useGLTF from drei - handles DRACO automatically
  const { scene: gltfScene, animations } = useGLTF('/night.glb');


  const matRef = useRef();
  const mixerRef = useRef();
  const timeRef = useRef(0);
  const blinkRef = useRef();
  const rainbowMats = useRef([]);
  const actionsRef = useRef({});

  const singlePlayAnimations = useRef([
    'Action.008',
    'Action.009',
    'Action.002',
    'Action.016',
    'Armature.027Action',
  ]);

  const textTexture = useSlidingTextTexture();
  const scoreboardTexture = useSlidingScoreboardTexture(4);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  let modelScale = 0.02;

  const solidNames = ['Wall', 'Sofa005', 'CoffeeTable001', 'Wall_plain005', 'Floor001', 'Roof'];
  const collidersRef = useRef([]);

  useEffect(() => {
    if (!gltfScene) return;

    collidersRef.current = [];

    gltfScene.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = false;

        if (child.name === 'Ground005') {
          if (!matRef.current) matRef.current = createWaterMaterial();
          child.material = matRef.current;

        } else if (child.name === 'Televison') {
          child.material = new THREE.MeshStandardMaterial({
            map: textTexture,
            emissive: new THREE.Color(0xffffff),
            emissiveMap: textTexture,
            emissiveIntensity: 2,
            toneMapped: false,
          });

        } else if (child.name === 'Plane021') {
          child.material = new THREE.MeshStandardMaterial({
            map: scoreboardTexture,
            emissive: new THREE.Color(0xffffff),
            emissiveMap: scoreboardTexture,
            emissiveIntensity: 2,
            toneMapped: false,
          });

        } else if (child.name === 'Text008') {
          blinkRef.current = child;
          child.material = new THREE.MeshBasicMaterial({ color: 'red', transparent: true });

        }
        else if (child.name === 'Text006') {
          blinkRef.current = child;
          child.material = new THREE.MeshBasicMaterial({ color: '#ff1d78', transparent: true}); // #ba5e8c , #efbf04 , #ff1dce

        } else if (child.name === 'Text004') {
          const rainbowMat = createRainbowShaderMaterial();
          rainbowMats.current.push(rainbowMat);
          child.material = rainbowMat;

        } else {
          const glassNames = [
            'FullWindow',
            'Sphere005',
            'TransparentWall',
            'CoffeeTable001',
            'Cube217',
            'Cube219',
            'Cube218',
            'Cube003',
            'Cube001',
            'Cube004',
            'Cube005',
            'Cube006',
            // 'Wall_plain002',
          ];
          if (glassNames.includes(child.name)) {
            child.material = new THREE.MeshPhysicalMaterial({
             color: new THREE.Color(0xccccff),
              metalness: 1,
              roughness: 0.1,
              transmission: 1.0,
              thickness: 0.9,
              ior: 1.45,
              transparent: true,
              opacity: 0.5,
              envMapIntensity: 10.5,
            });
          }
        }
      }
    });

    if (animations?.length) {
      mixerRef.current = new AnimationMixer(gltfScene);

      animations.forEach((clip) => {
        const action = mixerRef.current.clipAction(clip);
        actionsRef.current[clip.name] = action;

        if (singlePlayAnimations.current.includes(clip.name)) {
          action.setLoop(LoopOnce, 1);
          action.clampWhenFinished = true;
          action.reset();
          action.play();
        } else {
          action.setLoop(LoopRepeat, Infinity);
          action.play();
        }
      });

      mixerRef.current.addEventListener('finished', (e) => {
        const finishedAction = e.action;
        const finishedName = Object.entries(actionsRef.current).find(([name, act]) => act === finishedAction)?.[0];

        if (finishedName && singlePlayAnimations.current.includes(finishedName)) {
          finishedAction.clampWhenFinished = true;
          finishedAction.setLoop(THREE.LoopOnce, 0);
          finishedAction.paused = true;
        }
      });
    }
  }, [gltfScene, animations, textTexture, scoreboardTexture]);

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (matRef.current) matRef.current.uniforms.uTime.value = timeRef.current;
    if (mixerRef.current) mixerRef.current.update(delta);

    if (blinkRef.current) {
      const blink = Math.sin(timeRef.current * 5);
      blinkRef.current.material.opacity = 0.5 + 0.5 * blink;
    }

    rainbowMats.current.forEach((mat) => {
      mat.uniforms.uTime.value = timeRef.current * 1.5;
    });
  });

  useImperativeHandle(ref, () => ({
    scene: gltfScene,
    playAnimationsOnce: (names) => {
      names.forEach((name) => {
        const action = actionsRef.current[name];
        if (action) {
          action.reset();
          action.setLoop(LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
        } else {
          console.warn(`Animation '${name}' not found`);
        }
      });
    },
  }));

  return (
    <primitive
      object={gltfScene}
      scale={[modelScale, modelScale, modelScale]}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
      dispose={null}
    />
  );
});

export default Island;
