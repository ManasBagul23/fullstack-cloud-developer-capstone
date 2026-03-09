/**
 * Seed script to populate MongoDB with initial data
 */

const mongoose = require('mongoose');
const Dealer = require('./models/dealer');
const Review = require('./models/review');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dealership';

// Sample dealer data
const dealersData = [
    {
        id: 1,
        short_name: "Elite Motors",
        full_name: "Elite Motors Dealership",
        city: "New York",
        state: "NY",
        address: "123 Broadway Ave",
        zip: "10001",
        lat: 40.7128,
        long: -74.0060
    },
    {
        id: 2,
        short_name: "Pacific Auto",
        full_name: "Pacific Auto Group",
        city: "Los Angeles",
        state: "CA",
        address: "456 Sunset Blvd",
        zip: "90028",
        lat: 34.0522,
        long: -118.2437
    },
    {
        id: 3,
        short_name: "Windy City Cars",
        full_name: "Windy City Cars & Trucks",
        city: "Chicago",
        state: "IL",
        address: "789 Michigan Ave",
        zip: "60601",
        lat: 41.8781,
        long: -87.6298
    },
    {
        id: 4,
        short_name: "Lone Star Motors",
        full_name: "Lone Star Motors Dallas",
        city: "Dallas",
        state: "TX",
        address: "321 Commerce St",
        zip: "75201",
        lat: 32.7767,
        long: -96.7970
    },
    {
        id: 5,
        short_name: "Sunshine Auto",
        full_name: "Sunshine Auto Sales",
        city: "Miami",
        state: "FL",
        address: "555 Ocean Drive",
        zip: "33139",
        lat: 25.7617,
        long: -80.1918
    },
    {
        id: 6,
        short_name: "Bay Area Motors",
        full_name: "Bay Area Motors Inc",
        city: "San Francisco",
        state: "CA",
        address: "100 Market St",
        zip: "94102",
        lat: 37.7749,
        long: -122.4194
    },
    {
        id: 7,
        short_name: "Liberty Auto",
        full_name: "Liberty Auto Group",
        city: "Philadelphia",
        state: "PA",
        address: "200 Independence Mall",
        zip: "19106",
        lat: 39.9526,
        long: -75.1652
    },
    {
        id: 8,
        short_name: "Desert Sun Motors",
        full_name: "Desert Sun Motors Phoenix",
        city: "Phoenix",
        state: "AZ",
        address: "400 Central Ave",
        zip: "85004",
        lat: 33.4484,
        long: -112.0740
    },
    {
        id: 9,
        short_name: "Emerald City Auto",
        full_name: "Emerald City Auto Sales",
        city: "Seattle",
        state: "WA",
        address: "600 Pike St",
        zip: "98101",
        lat: 47.6062,
        long: -122.3321
    },
    {
        id: 10,
        short_name: "Rocky Mountain Motors",
        full_name: "Rocky Mountain Motors Denver",
        city: "Denver",
        state: "CO",
        address: "800 16th St",
        zip: "80202",
        lat: 39.7392,
        long: -104.9903
    }
];

// Sample review data
const reviewsData = [
    {
        id: 1,
        dealer_id: 1,
        name: "John Smith",
        review: "Excellent experience at Elite Motors! The staff was incredibly helpful and professional. I found my dream car at a great price. Highly recommend!",
        purchase: true,
        purchase_date: "2024-01-15",
        car_make: "Toyota",
        car_model: "Camry",
        car_year: 2024
    },
    {
        id: 2,
        dealer_id: 1,
        name: "Sarah Johnson",
        review: "Good selection of vehicles, but the wait time was a bit long. Overall satisfied with my purchase.",
        purchase: true,
        purchase_date: "2024-02-20",
        car_make: "Honda",
        car_model: "Civic",
        car_year: 2023
    },
    {
        id: 3,
        dealer_id: 2,
        name: "Mike Williams",
        review: "Pacific Auto has the best deals in LA! Amazing customer service and they really worked with my budget. Love my new SUV!",
        purchase: true,
        purchase_date: "2024-01-28",
        car_make: "Ford",
        car_model: "Explorer",
        car_year: 2024
    },
    {
        id: 4,
        dealer_id: 2,
        name: "Emily Davis",
        review: "Terrible experience. The salesperson was pushy and the prices were way higher than advertised. Would not recommend.",
        purchase: false,
        purchase_date: "",
        car_make: "",
        car_model: "",
        car_year: 0
    },
    {
        id: 5,
        dealer_id: 3,
        name: "Robert Brown",
        review: "Windy City Cars made buying a car easy and stress-free. Fair prices and honest salespeople. Great experience!",
        purchase: true,
        purchase_date: "2024-03-05",
        car_make: "Chevrolet",
        car_model: "Silverado",
        car_year: 2024
    },
    {
        id: 6,
        dealer_id: 4,
        name: "Jennifer Martinez",
        review: "Lone Star Motors has an impressive inventory. Found exactly what I was looking for. The paperwork process was quick too!",
        purchase: true,
        purchase_date: "2024-02-10",
        car_make: "Toyota",
        car_model: "Tacoma",
        car_year: 2024
    },
    {
        id: 7,
        dealer_id: 5,
        name: "David Wilson",
        review: "Love my new convertible from Sunshine Auto! Perfect for Miami weather. The team was friendly and knowledgeable.",
        purchase: true,
        purchase_date: "2024-01-20",
        car_make: "BMW",
        car_model: "4 Series",
        car_year: 2023
    },
    {
        id: 8,
        dealer_id: 6,
        name: "Lisa Anderson",
        review: "Bay Area Motors helped me find the perfect electric vehicle. They explained all the features and even helped set up home charging. Excellent service!",
        purchase: true,
        purchase_date: "2024-02-28",
        car_make: "Tesla",
        car_model: "Model 3",
        car_year: 2024
    },
    {
        id: 9,
        dealer_id: 7,
        name: "Christopher Lee",
        review: "Average experience at Liberty Auto. The car was good but the negotiation process felt uncomfortable.",
        purchase: true,
        purchase_date: "2024-03-10",
        car_make: "Jeep",
        car_model: "Wrangler",
        car_year: 2024
    },
    {
        id: 10,
        dealer_id: 8,
        name: "Amanda Taylor",
        review: "Desert Sun Motors went above and beyond! They stayed late to help me finalize my purchase. Couldn't be happier with my new truck!",
        purchase: true,
        purchase_date: "2024-01-30",
        car_make: "Ram",
        car_model: "1500",
        car_year: 2024
    },
    {
        id: 11,
        dealer_id: 9,
        name: "Daniel Garcia",
        review: "Emerald City Auto has the best hybrid selection in Seattle. Environmentally conscious and great prices. Highly recommend!",
        purchase: true,
        purchase_date: "2024-02-15",
        car_make: "Toyota",
        car_model: "Prius",
        car_year: 2024
    },
    {
        id: 12,
        dealer_id: 10,
        name: "Michelle Robinson",
        review: "Rocky Mountain Motors made my car buying experience enjoyable. No pressure sales tactics and transparent pricing. Will definitely come back!",
        purchase: true,
        purchase_date: "2024-03-01",
        car_make: "Subaru",
        car_model: "Outback",
        car_year: 2024
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Dealer.deleteMany({});
        await Review.deleteMany({});
        console.log('Cleared existing data');

        // Insert dealers
        await Dealer.insertMany(dealersData);
        console.log(`Inserted ${dealersData.length} dealers`);

        // Insert reviews
        await Review.insertMany(reviewsData);
        console.log(`Inserted ${reviewsData.length} reviews`);

        console.log('Database seeded successfully!');
        
        // Close connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run seed
seedDatabase();
