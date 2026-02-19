const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true,
        match: [/^[0-9]{10}$/, 'Please add a valid 10 digit phone number']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'collector'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    familyMembers: [
        {
            name: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true
            },
            gender: {
                type: String,
                enum: ['M', 'F', 'Other'],
                required: true
            },
            relation: {
                type: String,
                default: 'Other'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    addresses: [
        {
            type: {
                type: String,
                enum: ['home', 'work', 'other', 'current'],
                default: 'home'
            },
            label: String,
            address: String,
            flatNo: String,
            building: String,
            area: String,
            landmark: String,
            city: String,
            state: {
                type: String,
                default: 'Karnataka'
            },
            pincode: String,
            latitude: Number,
            longitude: Number,
            isDefault: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    cart: [
        {
            test: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Test'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    location: {
        latitude: Number,
        longitude: Number,
        address: String,
        updatedAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);