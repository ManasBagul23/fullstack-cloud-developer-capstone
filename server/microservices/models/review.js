/**
 * Mongoose model for Review
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    dealer_id: {
        type: Number,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    review: {
        type: String,
        required: true,
        trim: true
    },
    purchase: {
        type: Boolean,
        default: false
    },
    purchase_date: {
        type: String,
        default: ''
    },
    car_make: {
        type: String,
        trim: true,
        default: ''
    },
    car_model: {
        type: String,
        trim: true,
        default: ''
    },
    car_year: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            return ret;
        }
    }
});

// Create indexes for faster queries
reviewSchema.index({ dealer_id: 1 });
reviewSchema.index({ name: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
