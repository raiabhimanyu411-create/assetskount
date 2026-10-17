import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/*
 * "Register to reality": a field of asset records floats in a quiet grid.
 * A crimson scan beam sweeps across it; each record it passes resolves from
 * a pale ghost into a verified navy block, while a few flag as exceptions.
 */

const PALETTE = {
  ghost: new THREE.Color("#e0e3ec"),
  verified: new THREE.Color("#163e64"),
  exception: new THREE.Color("#852a35"),
  flash: new THREE.Color("#852a35"),
  fog: new THREE.Color("#f2f4f7"),
};

const VARIANTS = {
  hero: { cols: 24, rows: 12, spacing: 1.2, camera: [7.5, 8.2, 15.5], target: [3.4, -0.2, 0], offsetX: 3.2, sweep: 7.5 },
  ambient: { cols: 18, rows: 9, spacing: 1.35, camera: [9, 10.5, 17], target: [5, -0.8, 0], offsetX: 5.5, sweep: 9.5 },
};

const SWEEP_PAUSE = 2.6;
const RESET_TIME = 1.8;

function seeded(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function AssetField({ config, reducedMotion }) {
  const mesh = useRef();
  const beam = useRef();
  const glow = useRef();
  const light = useRef();
  const temp = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const { cols, rows, spacing, offsetX, sweep } = config;
  const count = cols * rows;
  const width = cols * spacing;

  const assets = useMemo(() => {
    const random = seeded(7);
    return Array.from({ length: count }, (_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      // Leave a few gaps so the field reads as a real register, not a slab.
      const missing = random() < 0.06;
      return {
        x: (col - cols / 2) * spacing + offsetX + (random() - 0.5) * 0.12,
        z: (row - rows / 2) * spacing + (random() - 0.5) * 0.12,
        height: 0.35 + random() ** 2 * 1.9,
        phase: random() * Math.PI * 2,
        scale: missing ? 0 : 1,
        state: 0,
        changedAt: -10,
        exception: random() < 0.07,
      };
    });
  }, [cols, rows, spacing, offsetX, count]);

  const beamMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color("#852a35") }, uStrength: { value: 1 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: `
      varying vec2 vUv; uniform vec3 uColor; uniform float uStrength;
      void main(){
        float core = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 6.0);
        float fade = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
        gl_FragColor = vec4(uColor, core * fade * 0.85 * uStrength);
      }`,
  }), []);

  const cycle = useRef({ start: 0, resetting: false });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const state = cycle.current;
    const elapsed = time - state.start;
    const start = -width / 2 + offsetX - 2;
    const end = width / 2 + offsetX + 2;

    let beamX = end;
    let beamOn = 0;
    if (elapsed < sweep) {
      const progress = elapsed / sweep;
      beamX = start + (end - start) * (0.5 - Math.cos(progress * Math.PI) / 2);
      beamOn = Math.min(1, elapsed * 2, (sweep - elapsed) * 2);
    } else if (elapsed > sweep + SWEEP_PAUSE && !state.resetting) {
      state.resetting = true;
      state.resetAt = time;
      assets.forEach((asset) => { asset.state = 0; asset.changedAt = time + ((asset.x - start) / (end - start)) * 0.9; });
    } else if (state.resetting && time - state.resetAt > RESET_TIME) {
      state.resetting = false;
      state.start = time;
      const random = seeded(Math.floor(time * 1000) || 3);
      assets.forEach((asset) => { asset.exception = random() < 0.07; });
    }

    if (reducedMotion) {
      beamX = start + (end - start) * 0.62;
      beamOn = 1;
    }

    if (beam.current) {
      beam.current.position.x = beamX;
      glow.current.position.x = beamX;
      beamMaterial.uniforms.uStrength.value = beamOn;
      light.current.position.x = beamX;
      light.current.intensity = 22 * beamOn;
    }

    assets.forEach((asset, index) => {
      if (!state.resetting && asset.state === 0 && beamOn > 0 && beamX > asset.x) {
        asset.state = asset.exception ? 2 : 1;
        asset.changedAt = time;
      }
      if (reducedMotion) {
        asset.state = beamX > asset.x ? (index % 13 === 0 ? 2 : 1) : 0;
        asset.changedAt = -10;
      }

      const since = time - asset.changedAt;
      const target = asset.state === 2 ? PALETTE.exception : asset.state === 1 ? PALETTE.verified : PALETTE.ghost;
      const from = asset.state === 0 ? PALETTE.verified : PALETTE.ghost;
      const blend = THREE.MathUtils.clamp(since / (asset.state === 0 ? 0.9 : 0.75), 0, 1);
      color.copy(from).lerp(target, blend);
      if (asset.state !== 0 && since < 0.45) color.lerp(PALETTE.flash, 1 - since / 0.45);
      mesh.current.setColorAt(index, color);

      const pop = asset.state !== 0 && since < 0.6 ? Math.sin((since / 0.6) * Math.PI) * 0.35 : 0;
      const bob = reducedMotion ? 0 : Math.sin(time * 0.7 + asset.phase) * 0.09;
      const height = asset.height * (1 + pop);
      temp.position.set(asset.x, height / 2 + bob + (asset.state === 2 ? 0.25 : 0), asset.z);
      temp.scale.set(asset.scale * 0.78, height * asset.scale, asset.scale * 0.78);
      temp.updateMatrix();
      mesh.current.setMatrixAt(index, temp.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.42} metalness={0.18} />
      </instancedMesh>

      <mesh ref={beam} position={[0, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} material={beamMaterial}>
        <planeGeometry args={[rows * spacing + 4, 7]} />
      </mesh>
      <mesh ref={glow} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} material={beamMaterial}>
        <planeGeometry args={[rows * spacing + 4, 2.4]} />
      </mesh>
      <pointLight ref={light} position={[0, 2.2, 0]} color="#852a35" distance={7} decay={1.6} />
    </group>
  );
}

function Dust({ count = 320, reducedMotion }) {
  const points = useRef();
  const positions = useMemo(() => {
    const random = seeded(19);
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (random() - 0.5) * 44;
      array[i * 3 + 1] = random() * 9;
      array[i * 3 + 2] = (random() - 0.5) * 26;
    }
    return array;
  }, [count]);

  useFrame(({ clock }) => {
    if (reducedMotion || !points.current) return;
    points.current.rotation.y = clock.getElapsedTime() * 0.012;
    points.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.25;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#852a35" size={0.05} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function CameraRig({ config, reducedMotion }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const look = useMemo(() => new THREE.Vector3(...config.target), [config]);

  useEffect(() => {
    const move = (event) => {
      pointer.current.x = event.clientX / window.innerWidth - 0.5;
      pointer.current.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame(({ clock }) => {
    const [x, y, z] = config.camera;
    if (reducedMotion) {
      camera.position.set(x, y, z);
      camera.lookAt(look);
      return;
    }
    const time = clock.getElapsedTime();
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.2);
    const targetX = x + pointer.current.x * 2.2 + Math.sin(time * 0.07) * 1.1;
    const targetY = y - pointer.current.y * 1.2 + scroll * 4.5;
    const targetZ = z + Math.cos(time * 0.05) * 0.8 + scroll * 3;
    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;
    camera.position.z += (targetZ - camera.position.z) * 0.035;
    camera.lookAt(look.x, look.y - scroll * 1.5, look.z);
  });

  return null;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Phones, low-core CPUs and low-memory devices start on the light tier.
function isLowPower() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 8;
  return cores <= 4 || memory <= 4 || window.innerWidth < 760;
}

// Watches real frame times. Sustained low FPS first drops the pixel ratio,
// then freezes the scene on a single still frame so scrolling stays smooth.
function FrameGuard({ onSlow }) {
  const sample = useRef({ frames: 0, time: 0, warmup: 1.2 });
  useFrame((_, delta) => {
    const s = sample.current;
    if (s.warmup > 0) { s.warmup -= delta; return; }
    s.frames += 1;
    s.time += Math.min(delta, 0.25);
    if (s.time >= 2) {
      const fps = s.frames / s.time;
      s.frames = 0;
      s.time = 0;
      if (fps < 40) {
        s.warmup = 1;
        onSlow(fps);
      }
    }
  });
  return null;
}

function scaleConfig(config, lowPower) {
  if (!lowPower) return config;
  return { ...config, cols: Math.round(config.cols * 0.7), rows: Math.round(config.rows * 0.75), spacing: config.spacing * 1.25 };
}

export default function HeroScene({ variant = "hero", className }) {
  const [lowPower] = useState(isLowPower);
  const config = useMemo(() => scaleConfig(VARIANTS[variant], lowPower), [variant, lowPower]);
  const wrapper = useRef(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [webgl] = useState(supportsWebGL);
  const [quality, setQuality] = useState(lowPower ? "low" : "high");
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  function downgrade(fps) {
    setQuality((current) => (current === "high" ? "low" : fps < 28 ? "still" : current));
  }

  // Stop rendering when the hero is off screen or the tab is hidden.
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    const onVisibility = () => setVisible(!document.hidden && element.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // The decorative backdrop on inner pages is not worth the cost on weak devices.
  if (!webgl || (variant === "ambient" && lowPower)) return null;

  const still = reducedMotion || quality === "still";

  return (
    <div ref={wrapper} className={className} aria-hidden="true" style={{ opacity: ready ? 1 : 0, transition: "opacity 1.6s ease" }}>
      <Canvas
        camera={{ position: config.camera, fov: 34, near: 0.1, far: 80 }}
        dpr={quality === "high" ? [1, 1.5] : 1}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: lowPower ? "default" : "high-performance" }}
        frameloop={visible ? (still ? "demand" : "always") : "never"}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.fog = new THREE.Fog(PALETTE.fog, 14, 38);
          setReady(true);
        }}
      >
        <ambientLight intensity={1.1} />
        <hemisphereLight args={["#ffffff", "#e0e3ec", 0.9]} />
        <directionalLight position={[6, 12, 8]} intensity={2.1} />
        <directionalLight position={[-8, 4, -6]} intensity={0.6} color="#fcf8f8" />
        <AssetField config={config} reducedMotion={still} />
        <Dust count={lowPower ? 120 : 320} reducedMotion={still} />
        <gridHelper args={[60, 50, "#e0e3ec", "#e0e3ec"]} position={[0, -0.01, 0]} />
        <CameraRig config={config} reducedMotion={still} />
        {!still && <FrameGuard onSlow={downgrade} />}
      </Canvas>
    </div>
  );
}
