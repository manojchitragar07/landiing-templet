import { Router } from 'express';
import os from 'os';

const router = Router();

/**
 * POST /api/terminal
 * Remote execution endpoint for cyber terminal commands
 */
router.post('/execute', (req, res) => {
    const { command } = req.body;
    if (!command) {
        return res.status(400).json({ error: 'No command supplied.' });
    }

    const cmd = command.trim().toLowerCase();

    switch (cmd) {
        case 'server':
        case 'status':
            return res.json({
                output: `
<span class="text-neon-cyan">REMOTE DAEMON TELEMETRY:</span>
-----------------------------------------------------------------
Daemon Status:   ONLINE
Server Runtime:  Node.js ${process.version} (${os.type()} ${os.arch()})
Memory Heap:     ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
Cluster Cores:   ${os.cpus().length} Logical Threads
TLS Security:    v1.3 Encrypted / CORS Verified
`
            });
        
        case 'ping':
            return res.json({
                output: `pong <span class="text-neon-green">64 bytes from backend: latency=1.2ms TTL=64</span>`
            });

        case 'uptime':
            return res.json({
                output: `System uptime: ${Math.floor(process.uptime())} seconds since daemon initialization.`
            });

        default:
            return res.json({
                output: null // Let client evaluate standard client-side commands
            });
    }
});

export default router;
