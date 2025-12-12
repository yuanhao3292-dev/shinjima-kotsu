import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, extend, Object3DNode } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { shaderMaterial, OrbitControls, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// -----------------------------------------------------------------------------
// 1. Custom Shader Material (The "Gemini" Look)
// -----------------------------------------------------------------------------

// We define the shader material to handle the iridescence and morphing
const ParticleShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uColor1: new THREE.Color('#00F0FF'), // Cyan
    uColor2: new THREE.Color('#9B8cFF'), // Purple
    uColor3: new THREE.Color('#FFD700'), // Gold/Pinkish Orange
    uMouse: new THREE.Vector3(0, 0, 0),
    uPixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 2,
    uSize: 4.0, // Particle size
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uSize;
    
    attribute vec3 aTarget;   // The target position (Text)
    attribute float aRandom;  // Random offset for organic noise
    attribute float aSpeed;   // Individual speed variance

    varying vec3 vPos;
    varying float vAlpha;

    // Simplex noise function for organic movement
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      
      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      
      // Permutations
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
               
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vPos = position;
      
      // Calculate Morphing: 
      // We start scattered (position attribute) and move to text (aTarget attribute).
      // We use a Sine wave on uTime to morph back and forth or just settle.
      // Here, we settle into the text but keep floating.
      
      float morphFactor = smoothstep(0.0, 3.0, uTime * 0.5); // Takes 6 seconds to fully morph
      morphFactor = clamp(morphFactor, 0.0, 1.0);

      vec3 mixedPos = mix(position, aTarget, morphFactor);

      // Add "Future Zen" Floating Noise
      // The noise is stronger when scattered, lighter when formed as text
      float noiseFreq = 0.5;
      float noiseAmp = mix(2.0, 0.15, morphFactor); 
      
      float noiseX = snoise(vec3(mixedPos.x * noiseFreq, mixedPos.y * noiseFreq, uTime * 0.2));
      float noiseY = snoise(vec3(mixedPos.x * noiseFreq, mixedPos.y * noiseFreq, uTime * 0.2 + 10.0));
      float noiseZ = snoise(vec3(mixedPos.x * noiseFreq, mixedPos.y * noiseFreq, uTime * 0.2 + 20.0));
      
      vec3 noiseVec = vec3(noiseX, noiseY, noiseZ) * noiseAmp;
      
      vec3 finalPos = mixedPos + noiseVec;

      // Perspective projection
      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation (particles get smaller when further away)
      gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);
      
      // Varying for color in fragment
      vPos = finalPos;
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    varying vec3 vPos;

    void main() {
      // 1. Circular particle shape (Soft glow)
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float r = length(xy);
      if (r > 0.5) discard;

      // Soft edge glow
      float glow = 1.0 - (r * 2.0);
      glow = pow(glow, 1.5);

      // 2. Holographic Color Logic
      // We mix colors based on spatial position and time to create the "iridescent" look
      
      // Normalize position roughly for color mapping
      vec3 colorPos = vPos * 0.1; 
      
      float mix1 = sin(colorPos.x + uTime * 0.5) * 0.5 + 0.5;
      float mix2 = cos(colorPos.y + uTime * 0.3) * 0.5 + 0.5;
      
      vec3 colorA = mix(uColor1, uColor2, mix1);
      vec3 finalColor = mix(colorA, uColor3, mix2);

      // Add a brightness boost for the "additive" feel
      gl_FragColor = vec4(finalColor, glow);
    }
  `
);

extend({ ParticleShaderMaterial });

// -----------------------------------------------------------------------------
// 2. Particle System Component
// -----------------------------------------------------------------------------

const ParticleSystem = () => {
  // Load Font
  const font = useLoader(FontLoader, '/fonts/helvetiker_bold.typeface.json');
  
  // Refs
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Configuration
  const particleCount = 4000;
  const textString = "SHINJIMA AI";

  // Data Generation (Memoized)
  const { positions, targets, randoms } = useMemo(() => {
    // 1. Generate Text Target Positions
    const textGeo = new TextGeometry(textString, {
      font: font,
      size: 1.5,
      height: 0.1, // depth
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    textGeo.center(); // Center the text geometry
    
    // We need to sample points from the text surface.
    // TextGeometry usually has fewer vertices than we want particles.
    // Strategy: Distribute points randomly on the triangles of the text mesh.
    // However, for simplicity and performance in R3F, we can just grab vertices 
    // and if we need more, we interpolate or reuse.
    
    // Better strategy for "Volume":
    // Create a sampler (not included in standard THREE build easily without addons).
    // Simple Strategy: Use the vertices directly. If < particleCount, loop them.
    
    const textPositionsAttribute = textGeo.attributes.position;
    const textCount = textPositionsAttribute.count;

    const posArray = new Float32Array(particleCount * 3); // Start positions (Random Sphere)
    const targetArray = new Float32Array(particleCount * 3); // End positions (Text)
    const randomArray = new Float32Array(particleCount); // Randoms for noise

    for (let i = 0; i < particleCount; i++) {
      // A. Setup Random Start Position (Scattered Cloud)
      const r = 20 + Math.random() * 10; // Radius
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;

      // B. Setup Target Position (Text)
      // Cycle through text vertices if we have more particles than text vertices
      const textIndex = i % textCount;
      targetArray[i * 3] = textPositionsAttribute.getX(textIndex);
      targetArray[i * 3 + 1] = textPositionsAttribute.getY(textIndex);
      targetArray[i * 3 + 2] = textPositionsAttribute.getZ(textIndex);

      // C. Random attribute
      randomArray[i] = Math.random();
    }

    return {
      positions: posArray,
      targets: targetArray,
      randoms: randomArray
    };
  }, [font, textString]);

  // Animation Loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    
    // Optional: Gentle rotation of the whole cloud
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    // @ts-ignore
    <points ref={pointsRef}>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-aTarget"
          count={particleCount}
          array={targets}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-aRandom"
          count={particleCount}
          array={randoms}
          itemSize={1}
        />
      {/* @ts-ignore */}
      </bufferGeometry>
      {/* Custom shader component */}
      {/* @ts-ignore */}
      <particleShaderMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    {/* @ts-ignore */}
    </points>
  );
};

// -----------------------------------------------------------------------------
// 3. Main Exported Component
// -----------------------------------------------------------------------------

const ParticleBanner: React.FC = () => {
  return (
    <div className="w-full h-[600px] bg-[#050505] relative overflow-hidden">
      {/* 
        Fallback / Loading State could go here. 
        Suspense is handled by R3F but we can add a DOM loader overlay.
      */}
      <React.Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-cyan-500 font-mono text-sm animate-pulse">
          INITIALIZING NIIJIMA AI CORE...
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 12], fov: 35 }}
          dpr={[1, 2]} // Handle high DPI screens
          gl={{ 
            antialias: false, // Post-processing handles AA usually, or we disable for performance
            alpha: false,
            powerPreference: "high-performance"
          }} 
        >
          {/* @ts-ignore */}
          <color attach="background" args={['#050505']} />
          
          {/* Controls to let user explore, but restricted */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            rotateSpeed={0.5}
          />

          {/* Float wrapper adds gentle bobbing to the whole text object */}
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <ParticleSystem />
          </Float>

          {/* Post Processing for the "Glow" */}
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={1.5} 
              radius={0.6}
            />
          </EffectComposer>
        </Canvas>
      </React.Suspense>
      
      {/* Overlay UI (optional - e.g. Scroll Down indicator) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <p className="text-white/30 text-[10px] tracking-[0.5em] font-light animate-bounce">SCROLL TO BEGIN</p>
      </div>
    </div>
  );
};

export default ParticleBanner;