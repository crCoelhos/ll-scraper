const express = require('express');
const router = express.Router();
const crowlRoutes = require('./crowlRoutes');

router.use('/process/v1', crowlRoutes);

module.exports = router;
