const express = require('express')
const app = express()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const connectToDatabase = require('../models/db')
const router = express.Router()
const dotenv = require('dotenv')
const pino = require('pino')

dotenv.config()

// Create a Pino logger instance
const logger = pino()

const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async (request, response) => {
    try {
        const email = request.body.email
        const db = await connectToDatabase()
        const collection = db.collection('users')
        const existingEmail = await collection.findOne({ email: request.body.email })
        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(request.body.password, salt)

        const newUser = await collection.insertOne({
            email: request.body.email,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            password: hash,
            createdAt: new Date()
        })
        
        const payload = { user: { id: newUser.insertedId } }
        const authtoken = jwt.sign(payload, JWT_SECRET)

        logger.info('User registered successfully')
        response.status(201).json({ authtoken, email })
    } catch (error) {
        return response.status(500).send('Internal server error')
    }
})

module.exports = router
