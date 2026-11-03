import { Router } from 'express';

const router = Router();

// In-memory submissions repository
const submissions = [];

/**
 * POST /api/contact
 * Receives and validates encrypted contact payloads
 */
router.post('/', (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required payload parameters: name, email, or message'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid transmission channel: email address format is invalid'
            });
        }

        const receiptId = `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        const record = {
            receiptId,
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString(),
            ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        };

        submissions.push(record);
        console.log(`[PAYLOAD_RECEIVED] ${receiptId} from ${record.name} <${record.email}>`);

        return res.status(201).json({
            success: true,
            message: 'Transmission payload verified and stored successfully.',
            receipt: receiptId,
            timestamp: record.timestamp
        });
    } catch (err) {
        console.error('[CONTACT_ERROR]', err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error while processing transmission.'
        });
    }
});

/**
 * GET /api/contact/transmissions
 * View stored transmissions (for development/admin verification)
 */
router.get('/transmissions', (req, res) => {
    return res.json({
        total: submissions.length,
        data: submissions
    });
});

export default router;
