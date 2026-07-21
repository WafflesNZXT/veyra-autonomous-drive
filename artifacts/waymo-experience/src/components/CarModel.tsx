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

/** The compact VEYRA mark, rebuilt from the same paths used by the interface SVG. */
function buildVeyraBadgeShapes() {
  const scale = 0.0065;
  const x = (value: number) => (value - 16) * scale;
  const y = (value: number) => (16 - value) * scale;

  const outer = new THREE.Shape();
  outer.moveTo(x(3), y(5));
  outer.lineTo(x(14.4), y(27));
  outer.lineTo(x(17.6), y(27));
  outer.lineTo(x(29), y(5));
  outer.lineTo(x(25.2), y(5));
  outer.lineTo(x(16), y(22.9));
  outer.lineTo(x(6.8), y(5));
  outer.closePath();

  const accent = new THREE.Shape();
  accent.moveTo(x(12), y(5));
  accent.lineTo(x(16), y(12.8));
  accent.lineTo(x(20), y(5));
  accent.closePath();

  return { outer, accent };
}

/** Renders wide-tracked brand text to a transparent canvas texture. */
function makeLabelTexture(text: string, fontSize = 96, spacing = 30): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const font = `600 ${fontSize}px Inter, Helvetica, Arial, sans-serif`;
  let ctx = canvas.getContext('2d')!;
  ctx.font = font;
  let width = 40;
  for (const ch of text) width += ctx.measureText(ch).width + spacing;
  canvas.width = Math.ceil(width);
  canvas.height = Math.ceil(fontSize * 1.5);
  ctx = canvas.getContext('2d')!; // resize resets state
  ctx.font = font;
  ctx.fillStyle = '#dff4fb';
  ctx.textBaseline = 'middle';
  let x = 20;
  for (const ch of text) {
    ctx.fillText(ch, x, canvas.height / 2);
    x += ctx.measureText(ch).width + spacing;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Flat brand-label plane hovering just off the body side panel. */
function BrandLabel({
  text,
  position,
  side,
  height,
  opacity = 0.85,
}: {
  text: string;
  position: [number, number, number];
  side: 1 | -1;
  height: number;
  opacity?: number;
}) {
  const { texture, aspect } = useMemo(() => {
    const t = makeLabelTexture(text);
    return { texture: t, aspect: t.image.width / t.image.height };
  }, [text]);

  return (
    <mesh position={position} rotation={[0, side * (Math.PI / 2), 0]}>
      <planeGeometry args={[height * aspect, height]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

export function CarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const lidarBladeRef = useRef<THREE.Group>(null);

  const bodyGeo = useMemo(buildBodyGeometry, []);
  const canopyGeo = useMemo(buildCanopyGeometry, []);
  const badgeShapes = useMemo(buildVeyraBadgeShapes, []);

  const mat = useMemo(() => ({
    body: new THREE.MeshPhysicalMaterial({
      color: 0x0b0e16,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      envMapIntensity: 0.9,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x060c16,
      metalness: 0.3,
      roughness: 0.1,
      envMapIntensity: 1.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
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
    hubGlow: new THREE.MeshStandardMaterial({
      color: 0x033844,
      emissive: new THREE.Color(0x00a8cc),
      emissiveIntensity: 0.5,
      metalness: 0.6,
      roughness: 0.4,
    }),
    lightBar: new THREE.MeshStandardMaterial({
      color: 0x9adbe8,
      emissive: new THREE.Color(0xbfeef8),
      emissiveIntensity: 0.85,
      roughness: 0.3,
    }),
    badgeWhite: new THREE.MeshStandardMaterial({
      color: 0xf6fbff,
      emissive: new THREE.Color(0xd9f3ff),
      emissiveIntensity: 0.3,
      metalness: 0.3,
      roughness: 0.35,
    }),
    badgeAccent: new THREE.MeshStandardMaterial({
      color: 0x00b9de,
      emissive: new THREE.Color(0x00a8cc),
      emissiveIntensity: 0.42,
      metalness: 0.25,
      roughness: 0.32,
    }),
    headlight: new THREE.MeshStandardMaterial({
      color: 0x7fc4d8,
      emissive: new THREE.Color(0x9fe4f4),
      emissiveIntensity: 0.7,
      roughness: 0.3,
    }),
    taillight: new THREE.MeshStandardMaterial({
      color: 0x8c1420,
      emissive: new THREE.Color(0xff2438),
      emissiveIntensity: 0.65,
      roughness: 0.3,
    }),
    lidarGlow: new THREE.MeshStandardMaterial({
      color: 0x066a7a,
      emissive: new THREE.Color(0x00c4dd),
      emissiveIntensity: 0.7,
      roughness: 0.35,
    }),
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
      color: 0x00879e,
      transparent: true,
      opacity: 0.32,
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

        {/* ── VEYRA BRANDING ── */}
        {/* Front fascia V badge — two converging blades above the light bar */}
        <group position={[0, 0.615, 2.46]} rotation={[-0.18, 0, 0]}>
          <mesh position={[0, 0, 0.008]} material={mat.badgeWhite} renderOrder={1}>
            <shapeGeometry args={[badgeShapes.outer]} />
          </mesh>
          <mesh position={[0, 0, 0.009]} material={mat.badgeAccent} renderOrder={2}>
            <shapeGeometry args={[badgeShapes.accent]} />
          </mesh>
        </group>

        {/* Side wordmark — lower door area, both sides */}
        {([1, -1] as const).map((side) => (
          <BrandLabel
            key={`wm-${side}`}
            text="VEYRA"
            position={[side * 0.886, 0.42, 0.45]}
            side={side}
            height={0.058}
            opacity={0.8}
          />
        ))}

        {/* Model label — rear quarter, above the rear arch */}
        {([1, -1] as const).map((side) => (
          <BrandLabel
            key={`ml-${side}`}
            text="VEYRA ONE"
            position={[side * 0.878, 0.7, -1.5]}
            side={side}
            height={0.032}
            opacity={0.6}
          />
        ))}

        {/* ── WHEELS ── */}
        <AeroWheel position={[0.72, 0.325, 1.45]} side={1} mat={mat} />
        <AeroWheel position={[-0.72, 0.325, 1.45]} side={-1} mat={mat} />
        <AeroWheel position={[0.72, 0.325, -1.45]} side={1} mat={mat} />
        <AeroWheel position={[-0.72, 0.325, -1.45]} side={-1} mat={mat} />
      </group>
    </group>
  );
}

/** Five-spoke concept wheel — clean proportions, recessed rim face, subtle accent */
function AeroWheel({
  position,
  side,
  mat,
}: {
  position: [number, number, number];
  side: 1 | -1;
  mat: Record<string, THREE.Material>;
}) {
  const spokes = useMemo(
    () => Array.from({ length: 5 }).map((_, i) => (i / 5) * Math.PI * 2),
    [],
  );

  const R = 0.325; // tire radius — clears the 0.48 wheel arch cleanly

  return (
    <group position={position}>
      {/* Tire — single solid cylinder, high segment count for a true circle */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat.tire} castShadow>
        <cylinderGeometry args={[R, R, 0.25, 64]} />
      </mesh>
      {/* Outer sidewall chamfer — flush, hugs the tire edge */}
      <mesh position={[side * 0.125, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mat.tire}>
        <torusGeometry args={[R - 0.028, 0.028, 12, 64]} />
      </mesh>

      {/* Rim barrel — recessed inside the tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat.rim}>
        <cylinderGeometry args={[0.235, 0.235, 0.2, 64]} />
      </mesh>

      {/* Outer rim lip ring — metallic, defines the wheel face */}
      <mesh position={[side * 0.105, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mat.rim}>
        <torusGeometry args={[0.235, 0.014, 12, 64]} />
      </mesh>

      {/* Five twin-spoke pairs — solid, embedded from hub to lip */}
      {spokes.map((a, i) => (
        <group key={i} rotation={[a, 0, 0]}>
          <mesh position={[side * 0.055, 0.125, 0.021]} material={mat.rim}>
            <boxGeometry args={[0.09, 0.235, 0.026]} />
          </mesh>
          <mesh position={[side * 0.055, 0.125, -0.021]} material={mat.rim}>
            <boxGeometry args={[0.09, 0.235, 0.026]} />
          </mesh>
        </group>
      ))}

      {/* Dark backing disc — hides through-gaps between spokes */}
      <mesh position={[side * -0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mat.rimSlot}>
        <cylinderGeometry args={[0.23, 0.23, 0.06, 64]} />
      </mesh>

      {/* Center hub — flat cap with recessed accent ring */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat.rim}>
        <cylinderGeometry args={[0.075, 0.075, 0.215, 32]} />
      </mesh>
      <mesh position={[side * 0.104, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={mat.hubGlow}>
        <torusGeometry args={[0.052, 0.006, 8, 32]} />
      </mesh>
    </group>
  );
}
