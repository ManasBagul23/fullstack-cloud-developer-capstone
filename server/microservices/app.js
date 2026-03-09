/**
 * Express.js Microservice for Dealer Reviews
 * 
 * This microservice handles dealer and review data storage
 * using MongoDB as the database.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import models
const Dealer = require('./models/dealer');
const Review = require('./models/review');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dealership';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// ==================== Health Check ====================

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Dealer Microservice is running',
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// ==================== Dealer Endpoints ====================

/**
 * GET /fetchDealers
 * Fetch all dealers from the database
 */
app.get('/fetchDealers', async (req, res) => {
    try {
        const dealers = await Dealer.find({});
        res.json(dealers);
    } catch (error) {
        console.error('Error fetching dealers:', error);
        res.status(500).json({ error: 'Could not fetch dealers' });
    }
});

/**
 * GET /fetchDealer/:id
 * Fetch a single dealer by ID
 */
app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const dealerId = parseInt(req.params.id);
        const dealer = await Dealer.findOne({ id: dealerId });
        
        if (dealer) {
            res.json(dealer);
        } else {
            res.status(404).json({ error: 'Dealer not found' });
        }
    } catch (error) {
        console.error('Error fetching dealer:', error);
        res.status(500).json({ error: 'Could not fetch dealer' });
    }
});

/**
 * GET /fetchDealers/state/:state
 * Fetch dealers by state
 */
app.get('/fetchDealers/state/:state', async (req, res) => {
    try {
        const state = req.params.state;
        const dealers = await Dealer.find({ state: state });
        res.json(dealers);
    } catch (error) {
        console.error('Error fetching dealers by state:', error);
        res.status(500).json({ error: 'Could not fetch dealers by state' });
    }
});

/**
 * POST /insertDealer
 * Insert a new dealer
 */
app.post('/insertDealer', async (req, res) => {
    try {
        const dealerData = req.body;
        
        // Get the next ID
        const lastDealer = await Dealer.findOne().sort({ id: -1 });
        dealerData.id = lastDealer ? lastDealer.id + 1 : 1;
        
        const dealer = new Dealer(dealerData);
        await dealer.save();
        
        res.status(201).json({ message: 'Dealer added successfully', dealer });
    } catch (error) {
        console.error('Error inserting dealer:', error);
        res.status(500).json({ error: 'Could not insert dealer' });
    }
});

// ==================== Review Endpoints ====================

/**
 * GET /fetchReviews/dealer/:id
 * Fetch all reviews for a specific dealer
 */
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const dealerId = parseInt(req.params.id);
        const reviews = await Review.find({ dealer_id: dealerId });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Could not fetch reviews' });
    }
});

/**
 * GET /fetchReviews
 * Fetch all reviews
 */
app.get('/fetchReviews', async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ error: 'Could not fetch reviews' });
    }
});

/**
 * POST /insertReview
 * Insert a new review
 */
app.post('/insertReview', async (req, res) => {
    try {
        const reviewData = req.body;
        
        // Get the next ID
        const lastReview = await Review.findOne().sort({ id: -1 });
        reviewData.id = lastReview ? lastReview.id + 1 : 1;
        
        const review = new Review(reviewData);
        await review.save();
        
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        console.error('Error inserting review:', error);
        res.status(500).json({ error: 'Could not insert review' });
    }
});

/**
 * DELETE /deleteReview/:id
 * Delete a review by ID
 */
app.delete('/deleteReview/:id', async (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        const result = await Review.deleteOne({ id: reviewId });
        
        if (result.deletedCount > 0) {
            res.json({ message: 'Review deleted successfully' });
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Could not delete review' });
    }
});

// ==================== Error Handling ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// ==================== Start Server ====================

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
    console.log(`Dealer Microservice running on port ${PORT}`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
});

module.exports = app;
