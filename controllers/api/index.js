const router = require('express').Router();
const userRoutes = require('./userRoutes');
const budgetRoutes = require('./budgetRoutes');
const UserInfoRoutes = require('./UserInfoRoutes');

router.use('/users', userRoutes);
router.use('/budget', budgetRoutes);
router.use('/info', UserInfoRoutes);

module.exports = router;