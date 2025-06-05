import express from 'express';
import { getRecommendedProducts, getPopularProducts } from '../controllers/recommendation.controller.js';

const router = express.Router();

router.get('/recommend/:userId', getRecommendedProducts);
router.get('/popular', getPopularProducts);

export default router;
