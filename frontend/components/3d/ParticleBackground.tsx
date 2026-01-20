"use client";

/**
 * 3D Particle Background using Three.js
 * Creates an animated particle system with floating geometric shapes
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField() {
    const ref = useRef<THREE.Points>(null);

    // Generate random particle positions and colors
    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(2000 * 3);
        const colors = new Float32Array(2000 * 3);

        // Define gradient colors (emerald to teal to cyan)
        const colorStops = [
            new THREE.Color("#10b981"), // emerald-500
            new THREE.Color("#14b8a6"), // teal-500
            new THREE.Color("#06b6d4"), // cyan-500
        ];

        for (let i = 0; i < 2000; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            // Color - gradient based on position
            const t = Math.random();
            let color;

            if (t < 0.33) {
                color = colorStops[0].clone().lerp(colorStops[1], t * 3);
            } else if (t < 0.66) {
                color = colorStops[1].clone().lerp(colorStops[2], (t - 0.33) * 3);
            } else {
                color = colorStops[2];
            }

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return { positions, colors };
    }, []);

    // Animate particles
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.05;
            ref.current.rotation.y += delta * 0.075;
        }
    });

    return (
        <points ref={ref} frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                transparent
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.7}
                vertexColors
            />
        </points>
    );
}

function FloatingCube({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Rotate on multiple axes
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.z += 0.005;

            // Float up and down with sine wave
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;

            // Drift left and right
            meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.5) * 0.3;

            // Slight depth movement
            meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.7) * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
                color="#14b8a6"
                transparent
                opacity={0.35}
                wireframe
                emissive="#14b8a6"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
}

function FloatingSphere({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Slower rotation for variety
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.008;
            meshRef.current.rotation.z += 0.003;

            // Different floating pattern (cosine for variety)
            meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.8) * 0.4;

            // Circular drift pattern
            meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.6) * 0.25;

            // Depth oscillation
            meshRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * 0.9) * 0.15;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
                color="#06b6d4"
                transparent
                opacity={0.25}
                wireframe
                emissive="#06b6d4"
                emissiveIntensity={0.15}
            />
        </mesh>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <ParticleField />
            <FloatingCube position={[-3, 2, -2]} />
            <FloatingCube position={[4, -1, -3]} />
            <FloatingSphere position={[2, 1, -1]} />
            <FloatingSphere position={[-2, -2, -2]} />
            <FloatingSphere position={[0, 3, -4]} />
        </>
    );
}

export function ParticleBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <Suspense fallback={null}>
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 75 }}
                    style={{ opacity: 0.4 }}
                    gl={{ alpha: true, antialias: true }}
                >
                    <Scene />
                </Canvas>
            </Suspense>
        </div>
    );
}
