import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import contactRouter from './routes/contact.js';
import telemetryRouter from './routes/telemetry.js';
import projectsRouter from './routes/projects.js';
import terminalRouter from './routes/terminal.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for dev/portfolio preview
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'manoj-portfolio-api',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/contact', contactRouter);
app.use('/api/telemetry', telemetryRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/terminal', terminalRouter);

// 404 Route handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} does not exist.`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[UNHANDLED_ERROR]', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Portfolio API Daemon is running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📡 Telemetry:    http://localhost:${PORT}/api/telemetry`);
    console.log(`📨 Contact API:   POST http://localhost:${PORT}/api/contact`);
    console.log(`======================================================\n`);
});

export default app;
