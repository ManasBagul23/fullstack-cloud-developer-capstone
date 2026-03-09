/**
 * Mongoose model for Dealer
 */

const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    short_name: {
        type: String,
        required: true,
        trim: true
    },
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    zip: {
        type: String,
        required: true,
        trim: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
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

// Create index for faster queries
dealerSchema.index({ state: 1 });
dealerSchema.index({ city: 1 });

const Dealer = mongoose.model('Dealer', dealerSchema);

module.exports = Dealer;
