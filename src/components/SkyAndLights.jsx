import { Suspense } from 'react';
import { Sky, Stars } from '@react-three/drei';

export default function SkyAndLights({ isDay }) {
  
  return (
    <>
      <ambientLight intensity={isDay ? 0.7 : 0.02} color={isDay ? '#ffffff' : '#666699'} />
      {isDay ? (
        <>
          <Sky 

              distance={4500000000000000000}
  sunPosition={[-500, 0, 40]} 
  inclination={1}          
  azimuth={0.25}             
  mieCoefficient={0.15}      
  mieDirectionalG={0.8}
  rayleigh={2.5}               
  turbidity={0.07}  
          />
        </>
      ) : (
        <>
          <Stars radius={200} depth={60} count={5000} factor={4} fade speed={0.5} />
          <ambientLight intensity={2} />
          <mesh position={[30, 40, -200]}>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial
              emissive="#f0f8ff"
              emissiveIntensity={0.8}
              color="#dcdcdc"
              roughness={1}
            />
          </mesh>
        </>
      )}
    </>
  );
}
