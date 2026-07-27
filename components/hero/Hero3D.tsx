"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll, Environment, Float, Text } from "@react-three/drei";
import * as THREE from "three";

function Ticket({ position, rotation, index }: { position: [number, number, number], rotation: [number, number, number], index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    const scrollOffset = scroll.offset;
    // Animate based on scroll - when camera passes the ticket, make it swing slightly
    const normalizedPos = position[2] / -20; // 0 to 1 roughly
    if (scrollOffset > normalizedPos - 0.1 && scrollOffset < normalizedPos + 0.1) {
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rotation[2] + Math.sin(state.clock.elapsedTime * 5) * 0.1, 0.1);
    } else {
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rotation[2], 0.1);
    }
  });

  return (
    <Float floatIntensity={0.5} rotationIntensity={0.2} speed={2}>
      <mesh position={position} rotation={rotation} ref={ref} castShadow receiveShadow>
        <planeGeometry args={[1.5, 2.5]} />
        <meshStandardMaterial color="#f8f5f2" roughness={0.8} />
        {/* Ticket content could be added via Drei Text or HTML, keeping it abstract for performance/elegance */}
        <Text
          position={[0, 0.8, 0.01]}
          fontSize={0.2}
          color="#201c18"
          anchorX="center"
          anchorY="middle"
        >
          {`Table ${index + 1}`}
        </Text>
        <Text
          position={[0, 0.4, 0.01]}
          fontSize={0.1}
          color="#201c18"
          anchorX="center"
          anchorY="middle"
        >
          {`Order #${1000 + index}`}
        </Text>
        <mesh position={[0, -0.2, 0.01]}>
          <planeGeometry args={[1.2, 0.02]} />
          <meshBasicMaterial color="#d4c9c1" />
        </mesh>
        <Text
          position={[0, -0.6, 0.01]}
          fontSize={0.15}
          color="#c4432c"
          anchorX="center"
          anchorY="middle"
        >
          Fired
        </Text>
      </mesh>
    </Float>
  );
}

function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();
  
  useFrame(() => {
    // Scroll goes from 0 to 1.
    // Move camera along Z axis from 5 to -20
    const targetZ = 5 - (scroll.offset * 25);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    // Slight look around based on scroll
    camera.position.x = Math.sin(scroll.offset * Math.PI) * 1.5;
    camera.lookAt(0, 0, targetZ - 5);
  });
  
  return null;
}

export function Hero3D() {
  return (
    <div className="w-full h-screen bg-ink relative">
      {/* HTML overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center mix-blend-difference">
        <h1 className="font-heading italic text-7xl md:text-9xl text-paper text-center">
          The Line<br/>Is Alive.
        </h1>
        <p className="font-mono text-sm text-paper/60 mt-4 tracking-[0.2em]">
          scroll to explore
        </p>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#0f0d0c']} />
        <fog attach="fog" args={['#0f0d0c', 5, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <spotLight position={[-10, 10, -5]} intensity={2} color="#c4432c" />
        
        <ScrollControls pages={3} damping={0.2}>
          <CameraRig />
          
          {/* The Rail */}
          <mesh position={[0, 1.3, -10]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 30]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Tickets */}
          {Array.from({ length: 15 }).map((_, i) => {
            const z = -i * 1.5;
            const x = Math.sin(i * 1.2) * 0.3;
            const rotZ = (Math.random() - 0.5) * 0.2;
            return (
              <Ticket 
                key={i} 
                index={i}
                position={[x, 0, z]} 
                rotation={[0, 0, rotZ]} 
              />
            );
          })}
        </ScrollControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
