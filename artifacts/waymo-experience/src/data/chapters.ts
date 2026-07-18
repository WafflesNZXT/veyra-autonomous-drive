export interface AnnotationData {
  id: string;
  position: [number, number, number];
  label: string;
  shortLabel: string;
}

export interface ChapterData {
  id: number;
  title: string;
  subtitle: string;
  stats: string[];
  annotations: AnnotationData[];
  cameraPos: [number, number, number];
  carRotation: [number, number, number];
  accentColor: string;
}

// Annotation positions are in car-local coordinates (ground = y 0, +Z = front)
export const CHAPTERS: ChapterData[] = [
  {
    id: 0,
    title: "VEYRA ONE",
    subtitle: "Intelligence in Motion.",
    stats: [],
    annotations: [],
    cameraPos: [3.7, 1.15, 5.6],
    carRotation: [0, -0.4, 0],
    accentColor: "#00d4ff",
  },
  {
    id: 1,
    title: "LIDAR ARRAY",
    subtitle: "VEYRA Sense · Eyes that never blink",
    stats: [
      "128-beam rotating LiDAR",
      "360° point cloud coverage",
      "200m detection range",
      "2.4M data points / second",
    ],
    annotations: [
      { id: "lidar-main", position: [0, 1.74, -0.3], label: "128-BEAM LIDAR", shortLabel: "LIDAR" },
    ],
    cameraPos: [1.7, 2.9, 4.7],
    carRotation: [0.14, -0.3, 0],
    accentColor: "#00d4ff",
  },
  {
    id: 2,
    title: "FORWARD RADAR",
    subtitle: "VEYRA Sense · Sees through any storm",
    stats: [
      "Long-range mmWave radar",
      "Penetrates rain, fog, darkness",
      "250m detection distance",
      "Tracks velocity of all objects",
    ],
    annotations: [
      { id: "front-radar", position: [0, 0.45, 2.56], label: "LONG-RANGE RADAR", shortLabel: "RADAR" },
    ],
    cameraPos: [0, 0.55, 6.6],
    carRotation: [0, 0, 0],
    accentColor: "#ff6b35",
  },
  {
    id: 3,
    title: "VISION SYSTEM",
    subtitle: "VEYRA Sense · Vision in every direction",
    stats: [
      "8 × 4K cameras",
      "360° visual coverage",
      "50m close-range detection",
      "Reads signals, markings, pedestrians",
    ],
    annotations: [
      { id: "cam-fl", position: [0.9, 0.8, 1.5], label: "FRONT-LEFT CAM", shortLabel: "CAM" },
      { id: "cam-fr", position: [-0.9, 0.8, 1.5], label: "FRONT-RIGHT CAM", shortLabel: "CAM" },
      { id: "cam-side", position: [0.92, 0.8, -0.3], label: "SIDE SENSOR POD", shortLabel: "CAM" },
    ],
    cameraPos: [4.6, 1.0, 4.0],
    carRotation: [0, 0.55, 0],
    accentColor: "#a855f7",
  },
  {
    id: 4,
    title: "PROXIMITY\nSENSORS",
    subtitle: "VEYRA Shield · Guarding every inch",
    stats: [
      "16 ultrasonic sensors",
      "8m proximity detection",
      "60 readings per second",
      "Safe low-speed maneuvering",
    ],
    annotations: [
      { id: "ultra-fl", position: [0.62, 0.3, 2.53], label: "ULTRASONIC", shortLabel: "US" },
      { id: "ultra-fr", position: [-0.62, 0.3, 2.53], label: "ULTRASONIC", shortLabel: "US" },
      { id: "ultra-rl", position: [0.62, 0.3, -2.5], label: "ULTRASONIC", shortLabel: "US" },
    ],
    cameraPos: [3.6, 0.4, 5.0],
    carRotation: [0.06, 0.35, 0],
    accentColor: "#22c55e",
  },
  {
    id: 5,
    title: "ONBOARD\nCOMPUTE",
    subtitle: "VEYRA Core · The mind of the machine",
    stats: [
      "Custom AI accelerator",
      "254 TOPS inference",
      "Quad-redundant processing",
      "Real-time decisions in <8ms",
    ],
    annotations: [
      { id: "compute", position: [0, 0.98, -1.9], label: "AI COMPUTE UNIT", shortLabel: "CPU" },
    ],
    cameraPos: [-3.4, 1.5, -5.2],
    carRotation: [0, Math.PI + 0.3, 0],
    accentColor: "#f59e0b",
  },
  {
    id: 6,
    title: "INTELLIGENCE\nIN MOTION.",
    subtitle: "VEYRA Network · Autonomous mobility, everywhere",
    stats: [
      "VEYRA Sense — full perception integration",
      "VEYRA Core — Level 4 autonomous compute",
      "VEYRA Shield — zero-compromise safety",
      "VEYRA Network — 50+ cities worldwide",
    ],
    annotations: [
      { id: "f-lidar", position: [0, 1.74, -0.3], label: "LIDAR", shortLabel: "LIDAR" },
      { id: "f-radar", position: [0, 0.45, 2.56], label: "RADAR", shortLabel: "RADAR" },
      { id: "f-cam-l", position: [0.9, 0.8, 1.5], label: "CAMERA", shortLabel: "CAM" },
      { id: "f-cam-r", position: [-0.9, 0.8, 1.5], label: "CAMERA", shortLabel: "CAM" },
      { id: "f-compute", position: [0, 0.98, -1.9], label: "COMPUTE", shortLabel: "CPU" },
    ],
    cameraPos: [3.9, 1.6, 5.8],
    carRotation: [0, 0.2, 0],
    accentColor: "#00d4ff",
  },
];
