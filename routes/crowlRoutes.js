import express from 'express';
import { Router } from 'express';

import crowlController from '../controllers/crowlController.js';

const router = Router();


router.get('/search/teste', (req, res) => {
    res.status(200).json({ message: 'user teste' });
});

router.get('/search/:keyword', crowlController.search);

export default router;
