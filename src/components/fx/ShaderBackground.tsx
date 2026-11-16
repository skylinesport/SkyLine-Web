import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ShaderMaterial, Color } from 'three';

/**
 * Animated "silk" background — a single full-screen fragment shader of soft
 * light ribbons drifting over near-black, with a faint lime tint in the
 * brightest folds (the upstream.so vibe, on-brand). It's one GPU quad, so it's
 * cheap; lazy-loaded and paused for reduced-motion (see where it's mounted).
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3 uColor;

  vec2 hash(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
  }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)), dot(hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
      mix(dot(hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)), dot(hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x),
      u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime * 0.04;

    // smooth, low-frequency flow → wide laminar ribbons (not turbulent smoke)
    vec2 q = vec2(fbm(uv * 1.3 + t), fbm(uv * 1.3 + vec2(5.2, 1.3) - t));
    float f = fbm(uv * 1.9 + q * 1.1 + t);
    float bands = 0.5 + 0.5 * sin((f * 3.0 + uv.x * 1.1 - uv.y * 1.5) * 3.14159);
    float silk = pow(bands, 3.5);

    vec3 col = vec3(0.008);                        // near-black base
    col += silk * vec3(0.05, 0.055, 0.062);        // faint grey ribbons
    col += pow(silk, 6.0) * mix(uColor, vec3(1.0), 0.35) * 0.11; // whisper of lime in sharpest folds

    // edge falloff so it melts into the page
    float vig = smoothstep(1.2, 0.25, length(vUv - 0.5));
    col *= mix(0.4, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function SilkPlane({ animate }: { animate: boolean }) {
  const mat = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1.6 },
      uColor: { value: new Color('#B8F03C') },
    }),
    [],
  );
  useFrame((_, delta) => {
    if (animate && mat.current) mat.current.uniforms.uTime.value += delta;
  });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

export default function ShaderBackground() {
  const animate =
    typeof window === 'undefined' ||
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <Canvas
      gl={{ antialias: false, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
      frameloop={animate ? 'always' : 'demand'}
    >
      <SilkPlane animate={animate} />
    </Canvas>
  );
}
