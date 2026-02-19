const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Get all family members for logged-in user
// @route   GET /api/v1/family-members
// @access  Private
exports.getFamilyMembers = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('familyMembers');
    
    res.status(200).json({
        success: true,
        count: user.familyMembers?.length || 0,
        data: user.familyMembers || []
    });
});

// @desc    Add family member
// @route   POST /api/v1/family-members
// @access  Private
exports.addFamilyMember = asyncHandler(async (req, res) => {
    const { name, age, gender, relation } = req.body;

    if (!name || !age || !gender) {
        return res.status(400).json({
            success: false,
            error: 'Please provide name, age, and gender'
        });
    }

    const user = await User.findById(req.user.id);
    
    const newMember = {
        name,
        age: parseInt(age),
        gender,
        relation: relation || 'Other'
    };

    user.familyMembers.push(newMember);
    await user.save();

    res.status(201).json({
        success: true,
        message: 'Family member added successfully',
        data: user.familyMembers[user.familyMembers.length - 1]
    });
});

// @desc    Update family member
// @route   PUT /api/v1/family-members/:memberId
// @access  Private
exports.updateFamilyMember = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const member = user.familyMembers.id(req.params.memberId);

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Family member not found'
        });
    }

    const { name, age, gender, relation } = req.body;
    if (name) member.name = name;
    if (age) member.age = parseInt(age);
    if (gender) member.gender = gender;
    if (relation) member.relation = relation;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Family member updated successfully',
        data: member
    });
});

// @desc    Delete family member
// @route   DELETE /api/v1/family-members/:memberId
// @access  Private
exports.deleteFamilyMember = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const member = user.familyMembers.id(req.params.memberId);

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Family member not found'
        });
    }

    member.deleteOne();
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Family member deleted successfully'
    });
});
