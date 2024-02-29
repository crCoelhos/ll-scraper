
import { Router } from 'express';
import crowl from '../controllers/crowl.js';
import main from '../controllers/mainCrowlController.js';

const router = Router();

router.get('/', (req, res) => {
    res.send('process/version is running');
});

router.get('/main/', (req, res) => {
    res.send('process/version/main is running');
});

app.get('/', (req, res) => {
    res.send('legaliga api running');
});


router.get('/search/:keyword', crowl.search);
router.get('/main/:keyword', main.search);

export default router;
