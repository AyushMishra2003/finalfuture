const express = require('express');
const {
    getFamilyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember
} = require('../controllers/familyMembers');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getFamilyMembers)
    .post(addFamilyMember);

router.route('/:memberId')
    .put(updateFamilyMember)
    .delete(deleteFamilyMember);

module.exports = router;
