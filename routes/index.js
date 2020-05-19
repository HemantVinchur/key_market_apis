const router = require('express').Router();

const userRouter = require('./userRoutes');
const profileRouter = require('./profileRoutes');


router.use('/user', userRouter);
router.use('/profile', profileRouter);

module.exports = router;