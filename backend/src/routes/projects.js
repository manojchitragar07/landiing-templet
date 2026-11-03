import { Router } from 'express';

const router = Router();

const projects = [
    {
        id: 'synapse-ui',
        title: 'Synapse-UI Node Graph',
        category: 'creative',
        year: '2024',
        badge: 'WEBGL / CANVAS',
        description: 'High-framerate collaborative node editor capable of rendering 10,000+ interactive connected nodes at 60 FPS using custom Canvas2D & WebGL shaders.',
        tags: ['TypeScript', 'WebGL', 'Zustand', 'WebSockets'],
        github: 'https://github.com/manojchitragar07',
        demoUrl: '#'
    },
    {
        id: 'hypervector-engine',
        title: 'HyperVector-Engine',
        category: 'ai',
        year: '2024',
        badge: 'RUST / WASM / AI',
        description: 'Sub-millisecond approximate nearest neighbor (ANN) vector search engine compiled into WebAssembly for in-browser zero-network semantic embedding retrieval.',
        tags: ['Rust', 'WASM', 'HNSW', 'SIMD'],
        github: 'https://github.com/manojchitragar07',
        demoUrl: '#'
    },
    {
        id: 'chronos-stream',
        title: 'Chronos Event Stream',
        category: 'systems',
        year: '2023',
        badge: 'GO / DISTRIBUTED',
        description: 'Distributed event streaming broker written in Go with raft consensus, processing 100,000+ financial telemetry events per second with sub-5ms p99 latency.',
        tags: ['Go', 'gRPC', 'Kafka', 'Docker'],
        github: 'https://github.com/manojchitragar07',
        demoUrl: '#'
    },
    {
        id: 'nexus-shader-studio',
        title: 'Nexus Shader Studio',
        category: 'creative',
        year: '2023',
        badge: 'NEXT.JS / WEBGPU',
        description: 'Next-generation procedural shader playground with real-time compilation, audio reactivity, and export pipelines for generative web designers.',
        tags: ['Next.js 15', 'WebGPU', 'GLSL', 'WebAudio'],
        github: 'https://github.com/manojchitragar07',
        demoUrl: '#'
    }
];

/**
 * GET /api/projects
 * Query all or filtered projects
 */
router.get('/', (req, res) => {
    const { category } = req.query;
    if (category && category !== 'all') {
        const filtered = projects.filter(p => p.category === category);
        return res.json({ total: filtered.length, projects: filtered });
    }
    return res.json({ total: projects.length, projects });
});

export default router;
