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

export const CHAPTERS: ChapterData[] = [
  {
    id: 0,
    title: "THE NEXT\nGENERATION\nROBOTAXI",
    subtitle: "Scroll to explore the technology inside",
    stats: [],
    annotations: [],
    cameraPos: [3.5, 1.8, 6],
    carRotation: [0, -0.4, 0],
    accentColor: "#00d4ff",
  },
  {
    id: 1,
    title: "LIDAR ARRAY",
    subtitle: "The eyes that never blink",
    stats: [
      "128-beam rotating LiDAR",
      "360° point cloud coverage",
      "200m detection range",
      "2.4M data points / second",
    ],
    annotations: [
      { id: "lidar-main", position: [0, 1.72, 0.1], label: "128-BEAM LIDAR", shortLabel: "LIDAR" },
    ],
    cameraPos: [1.5, 3.2, 5.5],
    carRotation: [0.18, -0.3, 0],
    accentColor: "#00d4ff",
  },
  {
    id: 2,
    title: "FORWARD RADAR",
    subtitle: "The guardian that sees through storms",
    stats: [
      "Long-range mmWave radar",
      "Penetrates rain, fog, darkness",
      "250m detection distance",
      "Tracks velocity of all objects",
    ],
    annotations: [
      { id: "front-radar", position: [0, 0.52, 2.55], label: "LONG-RANGE RADAR", shortLabel: "RADAR" },
    ],
    cameraPos: [0, 1.0, 7.5],
    carRotation: [0, 0, 0],
    accentColor: "#ff6b35",
  },
  {
    id: 3,
    title: "VISION SYSTEM",
    subtitle: "Eyes in every direction",
    stats: [
      "8 × 4K cameras",
      "360° visual coverage",
      "50m close-range detection",
      "Reads signals, markings, pedestrians",
    ],
    annotations: [
      { id: "cam-fl", position: [0.97, 0.92, 1.8], label: "FRONT-LEFT CAM", shortLabel: "CAM" },
      { id: "cam-fr", position: [-0.97, 0.92, 1.8], label: "FRONT-RIGHT CAM", shortLabel: "CAM" },
      { id: "cam-side", position: [1.0, 1.1, 0.2], label: "SIDE SENSOR POD", shortLabel: "CAM" },
    ],
    cameraPos: [4.5, 1.5, 4.5],
    carRotation: [0, 0.55, 0],
    accentColor: "#a855f7",
  },
  {
    id: 4,
    title: "PROXIMITY\nSENSORS",
    subtitle: "Whiskers for the urban jungle",
    stats: [
      "16 ultrasonic sensors",
      "8m proximity detection",
      "60 readings per second",
      "Safe low-speed maneuvering",
    ],
    annotations: [
      { id: "ultra-fl", position: [0.85, 0.22, 2.52], label: "ULTRASONIC", shortLabel: "US" },
      { id: "ultra-fr", position: [-0.85, 0.22, 2.52], label: "ULTRASONIC", shortLabel: "US" },
      { id: "ultra-rl", position: [0.85, 0.22, -2.52], label: "ULTRASONIC", shortLabel: "US" },
    ],
    cameraPos: [3.5, 0.4, 5.5],
    carRotation: [0.1, 0.35, 0],
    accentColor: "#22c55e",
  },
  {
    id: 5,
    title: "ONBOARD\nCOMPUTE",
    subtitle: "The brain that never sleeps",
    stats: [
      "Custom AI accelerator",
      "254 TOPS inference",
      "Quad-redundant processing",
      "Real-time decisions in <8ms",
    ],
    annotations: [
      { id: "compute", position: [0, 0.85, -2.4], label: "AI COMPUTE UNIT", shortLabel: "CPU" },
    ],
    cameraPos: [-3.5, 1.8, -5.5],
    carRotation: [0, Math.PI + 0.3, 0],
    accentColor: "#f59e0b",
  },
  {
    id: 6,
    title: "AUTONOMOUS.\nINTELLIGENT.\nSAFE.",
    subtitle: "40+ million miles of autonomous operation",
    stats: [
      "All sensor systems fully integrated",
      "Level 4 autonomous capability",
      "Zero dependency on human input",
      "Available in 50+ cities worldwide",
    ],
    annotations: [
      { id: "f-lidar", position: [0, 1.72, 0.1], label: "LIDAR", shortLabel: "LIDAR" },
      { id: "f-radar", position: [0, 0.52, 2.55], label: "RADAR", shortLabel: "RADAR" },
      { id: "f-cam-l", position: [0.97, 0.92, 1.8], label: "CAMERA", shortLabel: "CAM" },
      { id: "f-cam-r", position: [-0.97, 0.92, 1.8], label: "CAMERA", shortLabel: "CAM" },
      { id: "f-compute", position: [0, 0.85, -2.4], label: "COMPUTE", shortLabel: "CPU" },
    ],
    cameraPos: [3.5, 2.2, 6],
    carRotation: [0, 0.2, 0],
    accentColor: "#00d4ff",
  },
];
