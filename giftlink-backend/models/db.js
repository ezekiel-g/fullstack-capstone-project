require('dotenv').config()
const MongoClient = require('mongodb').MongoClient

// MongoDB connection URL with authentication options
let url = process.env.MONGO_URL

let dbInstance = null
const dbName = 'giftdb'

const connectToDatabase = async () => {
    if (dbInstance) return dbInstance

    const client = new MongoClient(url)

    try {
        await client.connect()
    } catch (error) {
        console.error(error.message)
    }

    dbInstance = client.db(dbName)

    return dbInstance
}

module.exports = connectToDatabase
