const express = require('express')
const router = express.Router()
const connectToDatabase = require('../models/db')

// Get all gifts
router.get('/', async (request, response) => {
    try {
        const db = await connectToDatabase()
        const collection = db.collection('gifts')
        const gifts = await collection.find({}).toArray()
        response.status(200).json(gifts)
    } catch (error) {
        console.error('Error fetching gifts: ', error)
        response.status(500).send('Error fetching gifts')
    }
})

// Get a single gift by ID
router.get('/:id', async (request, response) => {
    try {
        const id = request.params.id
        const db = await connectToDatabase()
        const collection = db.collection('gifts')
        const gift = await collection.findOne({ id: id })

        if (!gift) {
            return response.status(404).send('Gift not found')
        }

        response.status(200).json(gift)
    } catch (error) {
        console.error('Error fetching gift: ', error)
        response.status(500).send('Error fetching gift')
    }
})

// Add a new gift
router.post('/', async (request, response, next) => {
    try {
        const db = await connectToDatabase()
        const collection = db.collection('gifts')
        const gift = await collection.insertOne(request.body)

        response.status(201).json(gift.ops[0])
    } catch (error) {
        next(error)
    }
})

module.exports = router
