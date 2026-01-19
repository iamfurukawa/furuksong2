import type { Request, Response } from 'express';
import HealthCheckAdapter from '../../adapters/health-check.adapter.js';

class HealthCheck {
    async status(_: Request, res: Response) {
        const HealthCheckResponse = HealthCheckAdapter.toWireOut('ok', new Date());
        return res.json(HealthCheckResponse);
    }
}

export default new HealthCheck();