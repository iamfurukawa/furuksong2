import { Router } from 'express';
import HealthCheckController from '../controllers/health-check.controller.js';
import VersionController from '../controllers/version.controller.js';

const router = Router();

router.get('/health', HealthCheckController.status);
router.get('/version', VersionController.getCurrentVersion);

export default router;