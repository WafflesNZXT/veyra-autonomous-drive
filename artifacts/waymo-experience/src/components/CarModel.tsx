import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Original robotaxi design — purpose-built autonomous shuttle with distinctive silhouette
export function CarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  const mat = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial({
      color: 0x080c14,
      metalness: 0.92,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
    }),
    bodyDark: new THREE.MeshPhysicalMaterial({
      color: 0x050810,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.6,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x061828,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.75,
      ior: 1.5,
    }),
    tire: new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.0,
      roughness: 0.95,
    }),
    rim: new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.25,
    }),
    rimAccent: new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 1.0,
      roughness: 0.1,
      emissive: new THREE.Color(0x00d4ff),
      emissiveIntensity: 0.6,
    }),
    headlight: new THREE.MeshBasicMaterial({ color: 0xeafaff }),
    headlightGlow: new THREE.MeshBasicMaterial({
      color: 0x80e0ff,
      transparent: true,
      opacity: 0.7,
    }),
    taillight: new THREE.MeshBasicMaterial({ color: 0xff2020 }),
    sensorDark: new THREE.MeshStandardMaterial({
      color: 0x0d1020,
      metalness: 0.7,
      roughness: 0.3,
    }),
    lidarRing: new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 1,
      roughness: 0.1,
      emissive: new THREE.Color(0x00d4ff),
      emissiveIntensity: 1.2,
    }),
    accent: new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.9,
    }),
    accentSubtle: new THREE.MeshBasicMaterial({
      color: 0x0088aa,
      transparent: true,
      opacity: 0.5,
    }),
    underfloor: new THREE.MeshStandardMaterial({
      color: 0x030508,
      metalness: 0.3,
      roughness: 0.8,
    }),
  }), []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime + floatOffset.current;
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.025 + Math.sin(t * 0.3) * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.42, 0]}>

      {/* ── LOWER BODY SILL ── */}
      {/* Wide, flat base sill — gives the car a planted, low stance */}
      <mesh position={[0, 0.22, 0]} material={mat.bodyDark} castShadow>
        <boxGeometry args={[2.0, 0.44, 5.2]} />
      </mesh>

      {/* ── MAIN BODY ── */}
      {/* Primary upper body shell */}
      <mesh position={[0, 0.62, 0]} material={mat.body} castShadow>
        <boxGeometry args={[1.92, 0.56, 5.0]} />
      </mesh>

      {/* Aerodynamic nose taper (front wedge) */}
      <mesh position={[0, 0.42, 2.32]} rotation={[0.3, 0, 0]} material={mat.body} castShadow>
        <boxGeometry args={[1.88, 0.48, 0.65]} />
      </mesh>

      {/* Rear closure panel */}
      <mesh position={[0, 0.42, -2.3]} rotation={[-0.12, 0, 0]} material={mat.body} castShadow>
        <boxGeometry args={[1.88, 0.44, 0.5]} />
      </mesh>

      {/* ── HIGH-ROOF PASSENGER CABIN ── */}
      {/* Robotaxi cabins are taller to maximize passenger headroom */}
      <mesh position={[0, 1.28, -0.3]} material={mat.body} castShadow>
        <boxGeometry args={[1.82, 0.92, 3.6]} />
      </mesh>

      {/* Cabin roof panel — very slightly raised center for aerodynamics */}
      <mesh position={[0, 1.76, -0.3]} material={mat.body} castShadow>
        <boxGeometry args={[1.78, 0.1, 3.4]} />
      </mesh>

      {/* ── SENSOR ROOF FAIRING ── */}
      {/* Low-profile aerodynamic fairing housing LiDAR + camera cluster */}
      <mesh position={[0, 1.88, 0.1]} material={mat.bodyDark} castShadow>
        <boxGeometry args={[0.8, 0.12, 1.2]} />
      </mesh>

      {/* LiDAR main cylinder */}
      <mesh position={[0, 1.98, 0.1]} material={mat.sensorDark}>
        <cylinderGeometry args={[0.26, 0.28, 0.18, 36]} />
      </mesh>
      {/* LiDAR scanning ring — glows cyan */}
      <mesh position={[0, 1.98, 0.1]} material={mat.lidarRing}>
        <torusGeometry args={[0.27, 0.018, 12, 48]} />
      </mesh>
      {/* LiDAR dome top */}
      <mesh position={[0, 2.07, 0.1]} material={mat.glass}>
        <sphereGeometry args={[0.255, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Forward camera cluster on fairing */}
      <mesh position={[0, 1.87, 0.74]} material={mat.sensorDark}>
        <boxGeometry args={[0.38, 0.1, 0.18]} />
      </mesh>
      {/* Camera lenses */}
      <mesh position={[0.1, 1.87, 0.83]} rotation={[Math.PI / 2, 0, 0]} material={mat.glass}>
        <cylinderGeometry args={[0.028, 0.028, 0.06, 12]} />
      </mesh>
      <mesh position={[-0.1, 1.87, 0.83]} rotation={[Math.PI / 2, 0, 0]} material={mat.glass}>
        <cylinderGeometry args={[0.028, 0.028, 0.06, 12]} />
      </mesh>

      {/* ── A-PILLAR / WINDSHIELD ── */}
      {/* Raked windshield — more vertical than a sedan, typical for shuttle */}
      <mesh position={[0, 1.2, 1.76]} rotation={[-0.65, 0, 0]} material={mat.glass} castShadow>
        <planeGeometry args={[1.78, 1.05]} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 1.2, -2.1]} rotation={[0.5, 0, 0]} material={mat.glass} castShadow>
        <planeGeometry args={[1.74, 0.95]} />
      </mesh>

      {/* Side windows — two large passenger windows per side */}
      {/* Left side */}
      <mesh position={[0.962, 1.28, 0.55]} rotation={[0, Math.PI / 2, 0]} material={mat.glass}>
        <planeGeometry args={[1.4, 0.72]} />
      </mesh>
      <mesh position={[0.962, 1.28, -0.95]} rotation={[0, Math.PI / 2, 0]} material={mat.glass}>
        <planeGeometry args={[1.2, 0.72]} />
      </mesh>
      {/* Right side */}
      <mesh position={[-0.962, 1.28, 0.55]} rotation={[0, -Math.PI / 2, 0]} material={mat.glass}>
        <planeGeometry args={[1.4, 0.72]} />
      </mesh>
      <mesh position={[-0.962, 1.28, -0.95]} rotation={[0, -Math.PI / 2, 0]} material={mat.glass}>
        <planeGeometry args={[1.2, 0.72]} />
      </mesh>

      {/* ── FRONT FASCIA ── distinctive face */}
      {/* Front bumper / lower fascia */}
      <mesh position={[0, 0.26, 2.61]} material={mat.bodyDark} castShadow>
        <boxGeometry args={[1.88, 0.36, 0.1]} />
      </mesh>

      {/* Radar housing — centered, flush with front */}
      <mesh position={[0, 0.52, 2.62]} material={mat.sensorDark}>
        <boxGeometry args={[0.55, 0.18, 0.1]} />
      </mesh>

      {/* DRL/headlight bar — full-width illuminated strip */}
      <mesh position={[0, 0.78, 2.61]} material={mat.accent}>
        <boxGeometry args={[1.72, 0.028, 0.04]} />
      </mesh>

      {/* Headlight clusters */}
      <mesh position={[0.72, 0.65, 2.62]} material={mat.headlight}>
        <boxGeometry args={[0.38, 0.22, 0.06]} />
      </mesh>
      <mesh position={[-0.72, 0.65, 2.62]} material={mat.headlight}>
        <boxGeometry args={[0.38, 0.22, 0.06]} />
      </mesh>
      {/* Headlight inner glow */}
      <mesh position={[0.72, 0.65, 2.63]} material={mat.headlightGlow}>
        <boxGeometry args={[0.32, 0.16, 0.02]} />
      </mesh>
      <mesh position={[-0.72, 0.65, 2.63]} material={mat.headlightGlow}>
        <boxGeometry args={[0.32, 0.16, 0.02]} />
      </mesh>

      {/* Front side camera pods (replace traditional mirrors) */}
      <group position={[1.0, 0.92, 1.8]}>
        <mesh material={mat.bodyDark}>
          <boxGeometry args={[0.08, 0.16, 0.28]} />
        </mesh>
        <mesh position={[0.05, 0, 0.15]} material={mat.glass}>
          <cylinderGeometry args={[0.032, 0.032, 0.04, 12]} />
        </mesh>
      </group>
      <group position={[-1.0, 0.92, 1.8]}>
        <mesh material={mat.bodyDark}>
          <boxGeometry args={[0.08, 0.16, 0.28]} />
        </mesh>
        <mesh position={[-0.05, 0, 0.15]} material={mat.glass}>
          <cylinderGeometry args={[0.032, 0.032, 0.04, 12]} />
        </mesh>
      </group>

      {/* Side sensor pods — flush-mounted along mid-body (B-pillar area) */}
      <mesh position={[1.0, 1.1, 0.2]} material={mat.sensorDark}>
        <boxGeometry args={[0.06, 0.22, 0.38]} />
      </mesh>
      <mesh position={[-1.0, 1.1, 0.2]} material={mat.sensorDark}>
        <boxGeometry args={[0.06, 0.22, 0.38]} />
      </mesh>

      {/* ── REAR FASCIA ── */}
      <mesh position={[0, 0.26, -2.61]} material={mat.bodyDark} castShadow>
        <boxGeometry args={[1.88, 0.36, 0.1]} />
      </mesh>

      {/* Taillight bar — full-width */}
      <mesh position={[0, 0.75, -2.61]} material={mat.taillight}>
        <boxGeometry args={[1.72, 0.028, 0.04]} />
      </mesh>

      {/* Taillight clusters */}
      <mesh position={[0.7, 0.6, -2.62]} material={mat.taillight}>
        <boxGeometry args={[0.4, 0.22, 0.04]} />
      </mesh>
      <mesh position={[-0.7, 0.6, -2.62]} material={mat.taillight}>
        <boxGeometry args={[0.4, 0.22, 0.04]} />
      </mesh>

      {/* Compute unit housing — rear lower cavity */}
      <mesh position={[0, 0.85, -2.4]} material={mat.sensorDark} castShadow>
        <boxGeometry args={[1.1, 0.35, 0.55]} />
      </mesh>
      {/* Compute vent grid lines */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.85, -2.16]} material={mat.accentSubtle}>
          <boxGeometry args={[0.04, 0.25, 0.02]} />
        </mesh>
      ))}

      {/* ── ULTRASONIC SENSOR BUMPS ── */}
      {/* Front */}
      {[-0.85, -0.35, 0.35, 0.85].map((x, i) => (
        <mesh key={`uf-${i}`} position={[x, 0.22, 2.63]} material={mat.sensorDark}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 10]} />
        </mesh>
      ))}
      {/* Rear */}
      {[-0.85, -0.35, 0.35, 0.85].map((x, i) => (
        <mesh key={`ur-${i}`} position={[x, 0.22, -2.63]} material={mat.sensorDark}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 10]} />
        </mesh>
      ))}

      {/* ── DOOR LINES / PANEL GAPS (decorative) ── */}
      {/* Thin recessed horizontal body line */}
      <mesh position={[0.97, 0.68, 0]} rotation={[0, Math.PI / 2, 0]} material={mat.accentSubtle}>
        <planeGeometry args={[4.8, 0.008]} />
      </mesh>
      <mesh position={[-0.97, 0.68, 0]} rotation={[0, -Math.PI / 2, 0]} material={mat.accentSubtle}>
        <planeGeometry args={[4.8, 0.008]} />
      </mesh>

      {/* ── WHEELS ── */}
      <RobotaxiWheel position={[1.04, -0.12, 1.55]} side={1} mat={mat} />
      <RobotaxiWheel position={[-1.04, -0.12, 1.55]} side={-1} mat={mat} />
      <RobotaxiWheel position={[1.04, -0.12, -1.55]} side={1} mat={mat} />
      <RobotaxiWheel position={[-1.04, -0.12, -1.55]} side={-1} mat={mat} />

      {/* ── UNDERFLOOR BATTERY PACK ── flat slab between axles */}
      <mesh position={[0, -0.28, 0]} material={mat.underfloor} castShadow>
        <boxGeometry args={[1.78, 0.12, 2.8]} />
      </mesh>

      {/* Ground reflection glow */}
      <mesh position={[0, -0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 6.0]} />
        <meshBasicMaterial
          color="#001a33"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function RobotaxiWheel({
  position,
  side,
  mat,
}: {
  position: [number, number, number];
  side: 1 | -1;
  mat: Record<string, THREE.Material>;
}) {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.x = -state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat.tire} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.26, 40]} />
      </mesh>
      {/* Main rim */}
      <group rotation={[0, 0, Math.PI / 2]} ref={wheelRef}>
        <mesh material={mat.rim}>
          <cylinderGeometry args={[0.26, 0.26, 0.28, 36]} />
        </mesh>
        {/* 5-spoke design */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * 0.13,
                0,
                Math.sin(angle) * 0.13,
              ]}
              material={mat.rim}
            >
              <boxGeometry args={[0.055, 0.285, 0.16]} />
            </mesh>
          );
        })}
        {/* Center hub */}
        <mesh material={mat.rimAccent}>
          <cylinderGeometry args={[0.055, 0.055, 0.3, 16]} />
        </mesh>
      </group>
      {/* Rim accent ring (outer) */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat.rimAccent}>
        <torusGeometry args={[0.25, 0.008, 10, 40]} />
      </mesh>
    </group>
  );
}
