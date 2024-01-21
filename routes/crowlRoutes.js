const express = require('express');
const router = express.Router();
const crowlController = require('../controllers/crowlController');

// teste
router.get('/search/teste', (req, res) => {
    res.status(200).json({ message: 'user teste' });
});

router.post('/search/create-routine',);
router.get('/search/:keyword', crowlController.search);

module.exports = router;
