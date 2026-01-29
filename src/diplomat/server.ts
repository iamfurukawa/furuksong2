import HealthCheck from './http_in/health-check.js';
import Category from './http_in/category.js';
import Room from './http_in/room.js';
import Sound from './http_in/sound.js';

import { Router } from 'express';
import multer from 'multer';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/health', HealthCheck.status);
router.get('/categories', Category.getCategories);
router.post('/category', Category.createCategory);
router.put('/category/:id', Category.updateCategory);
router.delete('/category/:id', Category.deleteCategory);
router.get('/rooms', Room.getRooms);
router.post('/room', Room.createRoom);
router.put('/room/:id', Room.updateRoom);
router.delete('/room/:id', Room.deleteRoom);
router.get('/sounds', Sound.getAllSounds);
router.post('/sound', upload.single('file'), Sound.createSound as any);
router.put('/sound/:id', Sound.updateSound);
router.delete('/sound/:id', Sound.deleteSound);

export default router;