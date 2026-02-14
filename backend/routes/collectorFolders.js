const express = require('express');
const {
    createCollectorFolder,
    getCollectorFolders,
    getCollectorFolder,
    updateCollectorFolder,
    deleteCollectorFolder,
    getFolderByPincode,
    getFolderStats
} = require('../controllers/collectorFolder');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/pincode/:pincode', getFolderByPincode);

// Admin routes - temporarily allow without auth for testing
router.route('/')
    .get(getCollectorFolders)
    .post(createCollectorFolder);

router.route('/:id')
    .get(getCollectorFolder)
    .put(updateCollectorFolder)
    .delete(deleteCollectorFolder);

router.get('/:id/stats', getFolderStats);

module.exports = router;
