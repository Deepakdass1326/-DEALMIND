import express from 'express';
import { startGame, makeMove, getHistory, getGameById } from '../controllers/gameController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.post('/start', protect, startGame);
router.post('/move', protect, makeMove);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getGameById);

export default router;
