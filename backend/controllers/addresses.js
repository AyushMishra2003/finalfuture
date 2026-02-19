const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Get all addresses for logged-in user
// @route   GET /api/v1/addresses
// @access  Private
exports.getAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('addresses');
    
    res.status(200).json({
        success: true,
        count: user.addresses?.length || 0,
        data: user.addresses || []
    });
});

// @desc    Add address
// @route   POST /api/v1/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res) => {
    const { type, label, flatNo, building, area, landmark, city, state, pincode, latitude, longitude } = req.body;

    if (!flatNo || !area || !city || !pincode) {
        return res.status(400).json({
            success: false,
            error: 'Please provide flatNo, area, city, and pincode'
        });
    }

    const user = await User.findById(req.user.id);
    
    const newAddress = {
        type: type || 'home',
        label: label || (type === 'home' ? 'Home' : type === 'work' ? 'Work' : 'Other'),
        address: `${flatNo}${building ? ', ' + building : ''}, ${area}`,
        flatNo,
        building,
        area,
        landmark,
        city,
        state: state || 'Karnataka',
        pincode,
        latitude,
        longitude,
        isDefault: user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: user.addresses[user.addresses.length - 1]
    });
});

// @desc    Update address
// @route   PUT /api/v1/addresses/:addressId
// @access  Private
exports.updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
        return res.status(404).json({
            success: false,
            error: 'Address not found'
        });
    }

    const { type, label, flatNo, building, area, landmark, city, state, pincode, latitude, longitude } = req.body;
    
    if (type) address.type = type;
    if (label) address.label = label;
    if (flatNo) address.flatNo = flatNo;
    if (building !== undefined) address.building = building;
    if (area) address.area = area;
    if (landmark !== undefined) address.landmark = landmark;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (latitude) address.latitude = latitude;
    if (longitude) address.longitude = longitude;

    if (flatNo || building !== undefined || area) {
        address.address = `${address.flatNo}${address.building ? ', ' + address.building : ''}, ${address.area}`;
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: address
    });
});

// @desc    Delete address
// @route   DELETE /api/v1/addresses/:addressId
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
        return res.status(404).json({
            success: false,
            error: 'Address not found'
        });
    }

    address.deleteOne();
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
    });
});

// @desc    Set default address
// @route   PATCH /api/v1/addresses/:addressId/default
// @access  Private
exports.setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
        return res.status(404).json({
            success: false,
            error: 'Address not found'
        });
    }

    user.addresses.forEach(addr => {
        addr.isDefault = addr._id.toString() === req.params.addressId;
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Default address updated successfully',
        data: address
    });
});
