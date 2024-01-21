import express from 'express';
import { Router } from 'express';
import crowlRoutes from './crowlRoutes.js';

const router = Router();

router.use('/process/v1', crowlRoutes);

export default router;
