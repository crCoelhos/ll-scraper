
import { Router } from 'express';
import crowl from '../controllers/crowl.js';
import main from '../controllers/mainCrowlController.js';

const router = Router();

router.get('/search/:keyword', crowl.search);
router.get('/main/:keyword', main.search);

export default router;
