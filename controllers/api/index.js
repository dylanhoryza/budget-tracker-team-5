const router = require('express').Router();
const userRoutes = require('./userRoutes');
const budgetRoutes = require('./budgetRoutes');

router.use('/users', userRoutes);
router.use('/budget', budgetRoutes);

module.exports = router;