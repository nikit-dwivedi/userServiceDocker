const express = require('express');
const { login, verifyUserOtp, addSellerAuth, resendOtp, guestLogin } = require('../controllers/auth.controller');
const { authenticateAdmin } = require('../middlewares/authToken');
const router = express.Router();

router.post('/login', login);
router.post('/login/guest', guestLogin);
router.post('/verify', verifyUserOtp);
router.get('/resend/:reqId', resendOtp);
router.post('/seller', authenticateAdmin, addSellerAuth)


module.exports = router