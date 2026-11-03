import { Router } from 'express';
import os from 'os';

const router = Router();
const serverStartTime = Date.now();

/**
 * GET /api/telemetry
 * Returns live system health and performance telemetry
 */
router.get('/', (req, res) => {
    const memory = process.memoryUsage();
    const uptimeSec = Math.floor((Date.now() - serverStartTime) / 1000);

    const telemetry = {
        status: 'SYS_ONLINE',
        protocol: 'HTTP/2-TLS_1.3',
        nodeVersion: process.version,
        platform: `${os.type()} ${os.arch()}`,
        serverUptime: `${uptimeSec}s`,
        memory: {
            rssMb: (memory.rss / (1024 * 1024)).toFixed(2),
            heapUsedMb: (memory.heapUsed / (1024 * 1024)).toFixed(2)
        },
        clusterNodes: os.cpus().length,
        timestamp: new Date().toISOString()
    };

    res.json(telemetry);
});

export default router;
