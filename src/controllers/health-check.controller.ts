import type { Request, Response } from 'express';

class HealthCheckController {
    async status(req: Request, res: Response) {
        return res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }
}

export default new HealthCheckController();