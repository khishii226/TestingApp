import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

export default function TVLogo() {
 
  return (
    <group position={[-1.527, 0.253, 0.7]}>
      <Html center>
        <img src="./logo.png" alt="/logo" />
      </Html>
    </group>
  );
}
