const express = require('express');
const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require('../controllers/addresses');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAddresses)
    .post(addAddress);

router.route('/:addressId')
    .put(updateAddress)
    .delete(deleteAddress);

router.route('/:addressId/default')
    .patch(setDefaultAddress);

module.exports = router;
