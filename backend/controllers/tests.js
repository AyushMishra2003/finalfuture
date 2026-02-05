const Test = require('../models/Test');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/async');

// Mock data for when database is not available
const mockTests = [
    {
        _id: '1',
        name: 'Complete Blood Count',
        category: 'Single Test',
        price: 299,
        originalPrice: 499,
        discount: 40,
        description: 'Measures several components and features of your blood',
        preparation: 'No special preparation required',
        reportTime: '24 hours',
        isActive: true
    },
    {
        _id: '2',
        name: 'Fasting Blood Sugar',
        category: 'Single Test',
        price: 199,
        originalPrice: 299,
        discount: 33,
        description: 'Measures blood glucose levels after fasting',
        preparation: '8 hours fasting required',
        reportTime: '6 hours',
        isActive: true
    },
    {
        _id: '3',
        name: 'Thyroid Profile',
        category: 'Special Care Packages',
        price: 799,
        originalPrice: 1299,
        discount: 38,
        description: 'Comprehensive thyroid function test',
        preparation: 'No special preparation required',
        reportTime: '24 hours',
        isActive: true
    },
    {
        _id: '4',
        name: 'Liver Function Test',
        category: 'Special Care Packages',
        price: 599,
        originalPrice: 899,
        discount: 33,
        description: 'Assesses the function of the liver',
        preparation: 'No special preparation required',
        reportTime: '24 hours',
        isActive: true
    },
    {
        _id: '5',
        name: 'Kidney Function Test',
        category: 'Special Care Packages',
        price: 699,
        originalPrice: 999,
        discount: 30,
        description: 'Evaluates how well your kidneys are working',
        preparation: 'No special preparation required',
        reportTime: '24 hours',
        isActive: true
    }
];

// Utility function to check if database is connected
const isDatabaseConnected = () => {
    try {
        return Test.db.readyState === 1; // 1 means connected
    } catch (error) {
        console.error('Error checking database connection:', error);
        return false; // Assume not connected if there's an error
    }
};

// @desc    Get all tests
// @route   GET /api/v1/tests
// @access  Public
exports.getTests = asyncHandler(async (req, res, next) => {
    if (!isDatabaseConnected()) {
        return res.status(200).json({
            success: true,
            count: mockTests.length,
            data: mockTests
        });
    }

    try {
        res.status(200).json(res.advancedResults);
    } catch (error) {
        console.error('Error fetching all tests:', error);
        // Fallback to mock data in case of database error
        return res.status(200).json({
            success: true,
            count: mockTests.length,
            data: mockTests
        });
    }
});

// @desc    Get single test
// @route   GET /api/v1/tests/:id
// @access  Public
exports.getTest = asyncHandler(async (req, res, next) => {
    if (!isDatabaseConnected()) {
        const test = mockTests.find(test => test._id === req.params.id);
        if (!test) {
            return res.status(404).json({
                success: false,
                error: `Test not found with id of ${req.params.id}`
            });
        }
        return res.status(200).json({
            success: true,
            data: test
        });
    }

    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({
                success: false,
                error: `Test not found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: test
        });
    } catch (error) {
        console.error('Error fetching test by ID:', error);
        // Fallback to mock data in case of database error
        const test = mockTests.find(test => test._id === req.params.id);
        if (!test) {
            return res.status(404).json({
                success: false,
                error: `Test not found with id of ${req.params.id}`
            });
        }
        return res.status(200).json({
            success: true,
            data: test
        });
    }
});

// @desc    Get tests by category
// @route   GET /api/v1/tests/category/:category
// @access  Public
exports.getTestsByCategory = asyncHandler(async (req, res, next) => {
    if (!isDatabaseConnected()) {
        const filteredTests = mockTests.filter(test => test.category === req.params.category && test.isActive);
        return res.status(200).json({
            success: true,
            count: filteredTests.length,
            data: filteredTests
        });
    }

    try {
        const category = req.params.category;

        const tests = await Test.find({ category: category, isActive: true });

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (error) {
        console.error('Error fetching tests by category:', error);
        // Fallback to mock data in case of database error
        const filteredTests = mockTests.filter(test => test.category === req.params.category && test.isActive);
        return res.status(200).json({
            success: true,
            count: filteredTests.length,
            data: filteredTests
        });
    }
});

// @desc    Get selected tests for special care packages
// @route   GET /api/v1/tests/selected/Special Care Packages
// @access  Public
exports.getSelectedSpecialCare = asyncHandler(async (req, res, next) => {
    if (!isDatabaseConnected()) {
        const filteredTests = mockTests.filter(test => test.category === 'Special Care Packages' && test.isActive);
        return res.status(200).json({
            success: true,
            count: filteredTests.length,
            data: filteredTests
        });
    }

    try {
        const tests = await Test.find({
            category: 'Special Care Packages',
            isActive: true
        }).limit(10);

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (error) {
        console.error('Error fetching Special Care Packages:', error);
        // Fallback to mock data in case of database error
        const filteredTests = mockTests.filter(test => test.category === 'Special Care Packages' && test.isActive);
        return res.status(200).json({
            success: true,
            count: filteredTests.length,
            data: filteredTests
        });
    }
});

// @desc    Get selected tests for single tests
// @route   GET /api/v1/tests/selected/Single Test
// @route   GET /api/v1/tests/category/Exclusive
// @access  Public
exports.getSelectedSingleTests = asyncHandler(async (req, res, next) => {
    if (!isDatabaseConnected()) {
        const category = req.path.includes('Exclusive') ? 'Exclusive' : 'Single Test';
        const filteredTests = mockTests.filter(test => test.category === category && test.isActive);
        return res.status(200).json({
            success: true,
            count: filteredTests.length,
            data: filteredTests
        });
    }

    try {
        const category = req.path.includes('Exclusive') ? 'Exclusive' : 'Single Test';

        const tests = await Test.find({
            category: category,
            isActive: true
        }).limit(10);

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (error) {
        console.error('Error fetching Single Tests:', error);
        // Fallback to mock data in case of database error
        const category = req.path.includes('Exclusive') ? 'Exclusive' : 'Single Test';
        const filteredTests = mockTests.filter(test => test.category === category && test.isActive);
        return res.status(200).json({
            success: true,
            count: filteredTests.length,
            data: filteredTests
        });
    }
});

// @desc    Search tests
// @route   GET /api/v1/tests/search
// @access  Public
exports.searchTests = asyncHandler(async (req, res, next) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            success: false,
            error: 'Please provide a search term'
        });
    }

    if (!isDatabaseConnected()) {
        const regex = new RegExp(query, 'i');
        const results = mockTests.filter(test => regex.test(test.name) || regex.test(test.description));
        return res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    }

    try {
        const tests = await Test.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ],
            isActive: true
        }).limit(20);

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (error) {
        console.error('Error searching tests:', error);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @desc    Create new test
// @route   POST /api/v1/tests
// @access  Private/Admin
exports.createTest = asyncHandler(async (req, res, next) => {
    if (!isDatabaseConnected()) {
        return res.status(503).json({
            success: false,
            error: 'Database not available. Cannot create test.'
        });
    }

    try {
        const test = await Test.create(req.body);

        res.status(201).json({
            success: true,
            data: test
        });
    } catch (error) {
        console.error('Error creating test:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create test. Please try again.'
        });
    }
});

// @desc    Update test
// @route   PUT /api/v1/tests/:id
// @access  Private/Admin
exports.updateTest = asyncHandler(async (req, res, next) => {
    if (!isDatabaseConnected()) {
        return res.status(503).json({
            success: false,
            error: 'Database not available. Cannot update test.'
        });
    }

    try {
        const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                error: `Test not found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: test
        });
    } catch (error) {
        console.error('Error updating test:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update test. Please try again.'
        });
    }
});

// @desc    Delete test
// @route   DELETE /api/v1/tests/:id
// @access  Private/Admin
exports.deleteTest = asyncHandler(async (req, res, next) => {
    if (!isDatabaseConnected()) {
        return res.status(503).json({
            success: false,
            error: 'Database not available. Cannot delete test.'
        });
    }

    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({
                success: false,
                error: `Test not found with id of ${req.params.id}`
            });
        }

        await test.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting test:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete test. Please try again.'
        });
    }
});