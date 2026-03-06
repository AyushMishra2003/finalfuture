const express = require('express');
const {
  getDashboard,
  updateLocation,
  getOrderDetails,
  updateOrderStatus,
  uploadSamplePhoto,
  collectPayment
} = require('../controllers/phlebotomist');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer config for photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/samples/'),
  filename: (req, file, cb) => cb(null, `sample-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/dashboard', protect, getDashboard);
router.put('/location', protect, updateLocation);
router.get('/orders/:orderId', protect, getOrderDetails);
router.put('/orders/:orderId/status', protect, updateOrderStatus);
router.post('/orders/:orderId/sample-photo', protect, upload.single('photo'), uploadSamplePhoto);
router.post('/orders/:orderId/collect-payment', protect, collectPayment);

module.exports = router;
