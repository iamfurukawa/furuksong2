import { Router } from 'express';

import Version from './http_in/version.js';
import HealthCheck from './http_in/health-check.js';
import Category from './http_in/category.js';

const router = Router();

router.get('/health', HealthCheck.status);
router.get('/version', Version.getCurrentVersion);
router.get('/categories', Category.getCategories);
router.post('/category', Category.createCategory);
router.delete('/category/:id', Category.deleteCategory);

export default router;