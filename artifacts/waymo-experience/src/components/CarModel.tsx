import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Original concept robotaxi — built from smooth extruded curve profiles,
 * not boxes. Low aerodynamic body, raked glass canopy, wheel-arch cutouts,
 * turbine aero wheels, roof LiDAR module with spinning scan element.
 *
 * Coordinate system: +Z = front, Y up, ground at y=0.
 */

function buildBodyGeometry(): THREE.BufferGeometry {
  // Side profile (shape X = car Z length axis, shape Y = height)
  const s = new THREE.Shape();
  s.moveTo(2.25, 0.18);
  // Front fascia — forward-leaning, slight undercut
  s.quadraticCurveTo(2.44, 0.28, 2.4, 0.5);
  // Hood — long, gently falling toward windshield
  s.quadraticCurveTo(2.08, 0.68, 1.35, 0.73);
  // Beltline — rises subtly toward the rear haunch
  s.quadraticCurveTo(0.2, 0.82, -1.4, 0.86);
  // Rear shoulder — muscular taper down
  s.quadraticCurveTo(-2.1, 0.86, -2.32, 0.66);
  // Rear face — slight ducktail undercut
  s.quadraticCurveTo(-2.43, 0.42, -2.33, 0.18);
  // Bottom edge with wheel-arch cutouts
  s.lineTo(-1.93, 0.18);
  s.absarc(-1.45, 0.18, 0.48, Math.PI, 0, true); // rear arch
  s.lineTo(0.97, 0.18);
  s.absarc(1.45, 0.18, 0.48, Math.PI, 0, true); // front arch
  s.lineTo(2.25, 0.18);

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 1.5,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.12,
    bevelSegments: 8,
    curveSegments: 40,
  });
  geo.translate(0, 0, -0.75);
  geo.rotateY(-Math.PI / 2);
  // Weld vertices + recompute normals => smooth automotive surface
  const merged = mergeVertices(geo, 1e-4);
  merged.computeVertexNormals();
  return merged;
}

function buildCanopyGeometry(): THREE.BufferGeometry {
  // Glass greenhouse — raked windshield, curved roof, fastback rear glass
  const s = new THREE.Shape();
  s.moveTo(1.12, 0.68);
  s.quadraticCurveTo(0.72, 1.04, 0.3, 1.24);   // windshield rake
  s.quadraticCurveTo(-0.35, 1.36, -0.95, 1.28); // roof crown
  s.quadraticCurveTo(-1.5, 1.12, -1.78, 0.82);  // fastback rear glass
  s.lineTo(-1.78, 0.68);
  s.lineTo(1.12, 0.68);

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 1.26,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 5,
    curveSegments: 36,
  });
  geo.translate(0, 0, -0.63);
  geo.rotateY(-Math.PI / 2);
  const merged = mergeVertices(geo, 1e-4);
  merged.computeVertexNormals();
  return merged;
}

export function CarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const lidarBladeRef = useRef<THREE.Group>(null);

  const bodyGeo = useMemo(buildBodyGeometry, []);
  const canopyGeo = useMemo(buildCanopyGeometry, []);

  const mat = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial({
      color: 0x0b0e16,
      metalness: 0.9,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.5,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x060c16,
      metalness: 0.35,
      roughness: 0.03,
      envMapIntensity: 2.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    }),
    trim: new THREE.MeshStandardMaterial({
      color: 0x05070a,
      metalness: 0.4,
      roughness: 0.55,
    }),
    sensorHousing: new THREE.MeshStandardMaterial({
      color: 0x0c1018,
      metalness: 0.75,
      roughness: 0.25,
      envMapIntensity: 1.2,
    }),
    lens: new THREE.MeshPhysicalMaterial({
      color: 0x02060c,
      metalness: 0.2,
      roughness: 0.05,
      envMapIntensity: 2.5,
    }),
    tire: new THREE.MeshStandardMaterial({
      color: 0x060606,
      metalness: 0.0,
      roughness: 0.95,
    }),
    rim: new THREE.MeshStandardMaterial({
      color: 0x14161f,
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 1.4,
    }),
    rimSlot: new THREE.MeshStandardMaterial({
      color: 0x030405,
      metalness: 0.5,
      roughness: 0.6,
    }),
    hubGlow: new THREE.MeshBasicMaterial({ color: 0x00d4ff }),
    lightBar: new THREE.MeshBasicMaterial({ color: 0xd8fbff }),
    headlight: new THREE.MeshBasicMaterial({ color: 0xbdf3ff }),
    taillight: new THREE.MeshBasicMaterial({ color: 0xff2438 }),
    lidarGlow: new THREE.MeshBasicMaterial({ color: 0x00e5ff }),
    lidarGlass: new THREE.MeshPhysicalMaterial({
      color: 0x041018,
      metalness: 0.1,
      roughness: 0.08,
      transparent: true,
      opacity: 0.85,
      envMapIntensity: 2.0,
    }),
    beltAccent: new THREE.MeshBasicMaterial({
      color: 0x0e5468,
      transparent: true,
      opacity: 0.65,
    }),
    stage: new THREE.MeshStandardMaterial({
      color: 0x05070c,
      metalness: 0.65,
      roughness: 0.35,
      envMapIntensity: 0.8,
    }),
    stageRing: new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  }), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Barely-perceptible breathing — grounded, not floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.008;
    }
    if (lidarBladeRef.current) {
      lidarBladeRef.current.rotation.y += delta * 3.2;
    }
  });

  return (
    <group>
      {/* ── REVEAL STAGE ── */}
      <mesh position={[0, -0.035, 0]} material={mat.stage} receiveShadow>
        <cylinderGeometry args={[3.3, 3.42, 0.07, 72]} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat.stageRing}>
        <torusGeometry args={[3.3, 0.012, 8, 96]} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat.stageRing}>
        <torusGeometry args={[2.6, 0.006, 8, 96]} />
      </mesh>

      <group ref={groupRef}>
        {/* ── BODY SHELL ── */}
        <mesh geometry={bodyGeo} material={mat.body} castShadow />

        {/* ── GLASS CANOPY ── */}
        <mesh geometry={canopyGeo} material={mat.glass} castShadow />

        {/* ── UNDERBODY ── */}
        <mesh position={[0, 0.13, 0]} material={mat.trim}>
          <boxGeometry args={[1.6, 0.12, 3.5]} />
        </mesh>

        {/* Side skirts */}
        <mesh position={[0.8, 0.12, 0]} material={mat.trim}>
          <boxGeometry args={[0.16, 0.12, 2.55]} />
        </mesh>
        <mesh position={[-0.8, 0.12, 0]} material={mat.trim}>
          <boxGeometry args={[0.16, 0.12, 2.55]} />
        </mesh>

        {/* Front splitter + rear diffuser */}
        <mesh position={[0, 0.07, 2.18]} material={mat.trim}>
          <boxGeometry args={[1.52, 0.05, 0.42]} />
        </mesh>
        <mesh position={[0, 0.08, -2.12]} material={mat.trim}>
          <boxGeometry args={[1.52, 0.06, 0.45]} />
        </mesh>
        {[-0.45, -0.15, 0.15, 0.45].map((x) => (
          <mesh key={`fin-${x}`} position={[x, 0.05, -2.22]} material={mat.trim}>
            <boxGeometry args={[0.02, 0.1, 0.28]} />
          </mesh>
        ))}

        {/* ── FRONT LIGHTING SIGNATURE ── */}
        {/* Full-width light bar */}
        <mesh position={[0, 0.52, 2.5]} material={mat.lightBar}>
          <boxGeometry args={[1.56, 0.032, 0.05]} />
        </mesh>
        {/* Angled headlight blades */}
        <mesh position={[0.62, 0.45, 2.47]} rotation={[0, 0.32, -0.06]} material={mat.headlight}>
          <boxGeometry args={[0.34, 0.045, 0.04]} />
        </mesh>
        <mesh position={[-0.62, 0.45, 2.47]} rotation={[0, -0.32, 0.06]} material={mat.headlight}>
          <boxGeometry args={[0.34, 0.045, 0.04]} />
        </mesh>
        {/* Lower intake */}
        <mesh position={[0, 0.24, 2.4]} material={mat.trim}>
          <boxGeometry args={[1.24, 0.15, 0.16]} />
        </mesh>
        {/* Radar module behind intake center */}
        <mesh position={[0, 0.45, 2.49]} material={mat.sensorHousing}>
          <boxGeometry args={[0.44, 0.13, 0.06]} />
        </mesh>

        {/* ── REAR LIGHTING ── */}
        <mesh position={[0, 0.62, -2.5]} material={mat.taillight}>
          <boxGeometry args={[1.62, 0.03, 0.05]} />
        </mesh>
        <mesh position={[0.68, 0.55, -2.47]} rotation={[0, -0.2, 0]} material={mat.taillight}>
          <boxGeometry args={[0.26, 0.04, 0.04]} />
        </mesh>
        <mesh position={[-0.68, 0.55, -2.47]} rotation={[0, 0.2, 0]} material={mat.taillight}>
          <boxGeometry args={[0.26, 0.04, 0.04]} />
        </mesh>

        {/* ── BELTLINE ACCENT SEAM ── */}
        <mesh position={[0.875, 0.79, 0.1]} material={mat.beltAccent}>
          <boxGeometry args={[0.008, 0.012, 3.7]} />
        </mesh>
        <mesh position={[-0.875, 0.79, 0.1]} material={mat.beltAccent}>
          <boxGeometry args={[0.008, 0.012, 3.7]} />
        </mesh>

        {/* ── ROOF LIDAR MODULE ── */}
        <group position={[0, 0, -0.3]}>
          {/* Aero fairing base */}
          <mesh position={[0, 1.36, 0]} material={mat.sensorHousing} castShadow>
            <cylinderGeometry args={[0.3, 0.42, 0.12, 36]} />
          </mesh>
          {/* Main housing */}
          <mesh position={[0, 1.48, 0]} material={mat.sensorHousing}>
            <cylinderGeometry args={[0.24, 0.29, 0.16, 36]} />
          </mesh>
          {/* Glass scan band with spinning emitter blade */}
          <mesh position={[0, 1.585, 0]} material={mat.lidarGlass}>
            <cylinderGeometry args={[0.25, 0.25, 0.1, 36]} />
          </mesh>
          <group ref={lidarBladeRef} position={[0, 1.585, 0]}>
            <mesh position={[0.09, 0, 0]} material={mat.lidarGlow}>
              <boxGeometry args={[0.16, 0.06, 0.02]} />
            </mesh>
          </group>
          {/* Emissive ring seam */}
          <mesh position={[0, 1.53, 0]} material={mat.lidarGlow}>
            <torusGeometry args={[0.255, 0.008, 8, 48]} />
          </mesh>
          {/* Cap dome */}
          <mesh position={[0, 1.63, 0]} material={mat.sensorHousing}>
            <sphereGeometry args={[0.24, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>

        {/* ── FENDER CAMERA PODS ── */}
        {([1, -1] as const).map((side) => (
          <group key={`fpod-${side}`} position={[side * 0.84, 0.78, 1.5]}>
            <mesh material={mat.sensorHousing}>
              <boxGeometry args={[0.07, 0.09, 0.22]} />
            </mesh>
            <mesh position={[side * 0.04, 0, 0.08]} rotation={[0, 0, side * -Math.PI / 2]} material={mat.lens}>
              <cylinderGeometry args={[0.028, 0.028, 0.03, 14]} />
            </mesh>
          </group>
        ))}

        {/* ── SIDE SENSOR PODS (B-pillar) ── */}
        {([1, -1] as const).map((side) => (
          <group key={`spod-${side}`} position={[side * 0.86, 0.78, -0.3]}>
            <mesh material={mat.sensorHousing}>
              <boxGeometry args={[0.06, 0.1, 0.3]} />
            </mesh>
            <mesh position={[side * 0.035, 0.01, 0]} rotation={[0, 0, side * -Math.PI / 2]} material={mat.lens}>
              <cylinderGeometry args={[0.03, 0.03, 0.025, 14]} />
            </mesh>
          </group>
        ))}

        {/* ── ULTRASONIC SENSOR DOTS ── */}
        {[-0.62, -0.24, 0.24, 0.62].map((x) => (
          <mesh key={`usf-${x}`} position={[x, 0.3, 2.47]} rotation={[Math.PI / 2, 0, 0]} material={mat.lens}>
            <cylinderGeometry args={[0.026, 0.026, 0.028, 12]} />
          </mesh>
        ))}
        {[-0.62, -0.24, 0.24, 0.62].map((x) => (
          <mesh key={`usr-${x}`} position={[x, 0.3, -2.44]} rotation={[Math.PI / 2, 0, 0]} material={mat.lens}>
            <cylinderGeometry args={[0.026, 0.026, 0.028, 12]} />
          </mesh>
        ))}

        {/* ── REAR COMPUTE PANEL ── */}
        <mesh position={[0, 0.88, -1.9]} material={mat.sensorHousing}>
          <boxGeometry args={[0.92, 0.05, 0.52]} />
        </mesh>
        {[-0.28, 0, 0.28].map((x) => (
          <mesh key={`vent-${x}`} position={[x, 0.91, -1.9]} material={mat.beltAccent}>
            <boxGeometry args={[0.05, 0.008, 0.4]} />
          </mesh>
        ))}

        {/* ── WHEELS ── */}
        <AeroWheel position={[0.72, 0.34, 1.45]} side={1} mat={mat} />
        <AeroWheel position={[-0.72, 0.34, 1.45]} side={-1} mat={mat} />
        <AeroWheel position={[0.72, 0.34, -1.45]} side={1} mat={mat} />
        <AeroWheel position={[-0.72, 0.34, -1.45]} side={-1} mat={mat} />
      </group>
    </group>
  );
}

/** Covered turbine-style aero wheel — futuristic, premium, easy to read */
function AeroWheel({
  position,
  side,
  mat,
}: {
  position: [number, number, number];
  side: 1 | -1;
  mat: Record<string, THREE.Material>;
}) {
  const slots = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => (i / 8) * Math.PI * 2);
  }, []);

  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat.tire} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.24, 48]} />
      </mesh>
      {/* Rounded sidewall */}
      <mesh position={[side * 0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mat.tire}>
        <torusGeometry args={[0.3, 0.045, 12, 48]} />
      </mesh>
      {/* Solid aero disc */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat.rim}>
        <cylinderGeometry args={[0.245, 0.245, 0.25, 48]} />
      </mesh>
      {/* Turbine slots — radial recesses on outer face */}
      {slots.map((a, i) => (
        <mesh
          key={i}
          position={[side * 0.127, Math.cos(a) * 0.14, Math.sin(a) * 0.14]}
          rotation={[a, 0, 0]}
          material={mat.rimSlot}
        >
          <boxGeometry args={[0.008, 0.13, 0.035]} />
        </mesh>
      ))}
      {/* Center hub + emissive ring */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat.rim}>
        <cylinderGeometry args={[0.07, 0.07, 0.27, 24]} />
      </mesh>
      <mesh position={[side * 0.136, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mat.hubGlow}>
        <torusGeometry args={[0.075, 0.007, 8, 32]} />
      </mesh>
    </group>
  );
}
