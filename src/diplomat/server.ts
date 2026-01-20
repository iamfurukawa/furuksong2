import { Router } from 'express';

import Version from './http_in/version.js';
import HealthCheck from './http_in/health-check.js';
import Category from './http_in/category.js';
import Room from './http_in/room.js';

const router = Router();

router.get('/health', HealthCheck.status);
router.get('/version', Version.getCurrentVersion);
router.get('/categories', Category.getCategories);
router.post('/category', Category.createCategory);
router.delete('/category/:id', Category.deleteCategory);
router.get('/rooms', Room.getRooms);
router.post('/room', Room.createRoom);
router.delete('/room/:id', Room.deleteRoom);

export default router;