const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
    collectorFolderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectorFolder',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    currentBookings: {
        type: Number,
        default: 0,
        min: 0
    },
    maxBookings: {
        type: Number,
        required: true,
        min: 1
    },
    bookings: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        patientName: {
            type: String,
            required: true
        },
        patientPhone: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'reached', 'collected', 'moving_to_next', 'completed'],
            default: 'pending'
        },
        reachedAt: Date,
        collectedAt: Date,
        sampleStatus: {
            blood: {
                collected: { type: Boolean, default: false },
                image: String,
                collectedAt: Date,
                isRandom: { type: Boolean, default: false }
            },
            urine: {
                collected: { type: Boolean, default: false },
                image: String,
                collectedAt: Date,
                notGiven: { type: Boolean, default: false }
            },
            other: {
                collected: { type: Boolean, default: false },
                image: String,
                collectedAt: Date
            }
        },
        paymentCollected: {
            type: Number,
            default: 0
        },
        paymentCollectedAt: Date,
        sampleHandedOver: {
            type: Boolean,
            default: false
        },
        sampleHandoverAt: Date,
        amountHandedOver: {
            type: Boolean,
            default: false
        },
        amountHandoverAt: Date,
        bookedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient queries
TimeSlotSchema.index({ collectorFolderId: 1, date: 1, hour: 1 }, { unique: true });

// Index for date queries
TimeSlotSchema.index({ date: 1 });

// Update isAvailable based on currentBookings
TimeSlotSchema.pre('save', function (next) {
    this.isAvailable = this.currentBookings < this.maxBookings;
    next();
});

// Virtual for time range display
TimeSlotSchema.virtual('timeRange').get(function () {
    const startHour = this.hour.toString().padStart(2, '0');
    const endHour = (this.hour + 1).toString().padStart(2, '0');
    return `${startHour}:00 - ${endHour}:00`;
});

// Virtual for remaining slots
TimeSlotSchema.virtual('remainingSlots').get(function () {
    return this.maxBookings - this.currentBookings;
});

// Ensure virtuals are included in JSON
TimeSlotSchema.set('toJSON', { virtuals: true });
TimeSlotSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
