import { Router } from 'express';

import Version from './http_in/version.js';
import HealthCheck from './http_in/health-check.js';

const router = Router();

router.get('/health', HealthCheck.status);
router.get('/version', Version.getCurrentVersion);

export default router;