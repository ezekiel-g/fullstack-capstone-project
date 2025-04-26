// db.js
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient

// MongoDB connection URL with authentication options
let url = process.env.MONGO_URL

let dbInstance = null
const dbName = 'giftdb'

const connectToDatabase = async () => {
    if (dbInstance) return dbInstance

    const client = new MongoClient(url)

    // Task 1: Connect to MongoDB
    try {
        await client.connect()
    } catch (error) {
        console.error(error.message)
    }

    // Task 2: Connect to database giftDB and store in variable dbInstance
    dbInstance = client.db(dbName)

    // Task 3: Return database instance
    return dbInstance
}

module.exports = connectToDatabase
