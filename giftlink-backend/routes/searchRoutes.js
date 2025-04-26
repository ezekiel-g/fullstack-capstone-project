const express = require('express')
const router = express.Router()
const connectToDatabase = require('../models/db')


// Search for gifts
router.get('/', async (request, response, next) => {
    try {
        const db = await connectToDatabase()
        const collection = db.collection('gifts')
        let query = {}

        // Add the name filter to the query if the name parameter is not empty
        if (request.query.name && request.query.name.trim() !== '') {
            // Using regex for partial match, case-insensitive
            query.name = { $regex: request.query.name, $options: 'i' }
        }

        // Add other filters to the query
        if (request.query.category) {
            query.category = request.query.category
        }
        if (request.query.condition) {
            query.condition = request.query.condition
        }
        if (request.query.age_years) {
            query.age_years = { $lte: parseInt(request.query.age_years) }
        }

        // Fetch filtered gifts using the find(query) method
        const gifts = await collection.find(query).toArray()
        response.status(200).json(gifts)
    } catch (error) {
        next(error)
    }
})

module.exports = router
