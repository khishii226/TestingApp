import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export default function Bird({
  position = [0, 5, 0],
  radius = 10,
  speed = 0.5,
  scale = 0.01,
  direction = 1,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF('/bird.glb');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive scale override
  const responsiveScale = useMemo(() => {
    if (windowWidth <= 400) return scale * 0.5;
    if (windowWidth <= 500) return scale * 0.65;
    if (windowWidth <= 730) return scale * 0.8;
    return scale;
  }, [windowWidth, scale]);

  const clonedScene = useMemo(() => {
    const cloneScene = clone(scene);
    if (direction === -1) {
      cloneScene.rotation.y = Math.PI; // rotate 180° around Y-axis
    }
    return cloneScene;
  }, [scene, direction]);

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions?.ArmatureAction?.play();
  }, [actions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed * direction;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    group.current.position.set(x, position[1], z);
    group.current.lookAt(0, position[1], 0);
  });

  return (
    <group ref={group}>
      <primitive object={clonedScene} scale={responsiveScale} />
    </group>
  );
}
