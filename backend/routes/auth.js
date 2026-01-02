const express = require('express');
const {
    register,
    login,
    adminLogin,
    logout,
    generateOTP,
    verifyOTP,
    getMe,
    updateDetails
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/logout', logout);
router.post('/otp/generate', generateOTP);
router.post('/otp/verify', verifyOTP);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;