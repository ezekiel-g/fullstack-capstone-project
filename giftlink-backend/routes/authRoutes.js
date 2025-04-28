/*jshint esversion: 8 */
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');
const { body, validationResult } = require('express-validator');

dotenv.config()

// Create a Pino logger instance
const logger = pino()

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (request, response) => {
    try {
        //Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingEmail = await collection.findOne({
            email: request.body.email
        })

        if (existingEmail) {
            logger.error('Email id already exists')
            return response.status(400).json({ error: 'Email id already exists' })
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(request.body.password, salt);
        const email = request.body.email;
        console.log('email is', email)
        const newUser = await collection.insertOne({
            email: request.body.email,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            password: hash,
            createdAt: new Date()
        })

        const payload = { user: { id: newUser.insertedId } };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully')
        response.json({ authtoken, email })
    } catch (error) {
        logger.error(error)
        return response.status(500).send('Internal server error')
    }
})

router.post('/login', async (request, response) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const theUser = await collection.findOne({ email: request.body.email });

        if (theUser) {
            let result = await bcryptjs.compare(
                request.body.password,
                theUser.password
            );

            if (!result) {
                logger.error('Passwords do not match')
                return response.status(404).json({ error: 'Wrong pasword' })
            }

            let payload = { user: { id: theUser._id.toString() } };
            const userName = theUser.firstName;
            const userEmail = theUser.email;
            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User logged in successfully')
            return response.status(200).json({ authtoken, userName, userEmail })
        } else {
            logger.error('User not found')
            return response.status(404).json({ error: 'User not found' })
        }
    } catch (error) {
        logger.error(error)
        return response
            .status(500)
            .json({ error: 'Internal server error', details: error.message })
    }
});

// Update user
router.put('/update', async (request, response) => {
    const errors = validationResult(request)

    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array())
        return response.status(400).json({ errors: errors.array() })
    }

    try {
        const email = request.headers.email;

        if (!email) {
            logger.error('Email not found in the request headers')
            return response
                .status(400)
                .json({ error: 'Email not found in the request headers' })
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email });

        if (!existingUser) {
            logger.error('User not found')
            return response.status(404).json({ error: 'User not found' })
        }

        existingUser.firstName = request.body.name
        existingUser.updatedAt = new Date()

        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );

        const payload = { user: { id: updatedUser._id.toString() } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User updated successfully')
        response.json({ authtoken })
    } catch (error) {
        logger.error(error)
        return response.status(500).send('Internal Server Error')
    }
})

module.exports = router;
