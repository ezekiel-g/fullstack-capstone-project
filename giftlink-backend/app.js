require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pinoLogger = require('./logger')
const connectToDatabase = require('./models/db')
const { loadData } = require('./util/import-mongo/index')

const app = express()
app.use('*', cors())
const port = 3060

// Connect to MongoDB; we just do this one time
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB')
    })
    .catch(error => console.error('Failed to connect to DB: ', error.message))

app.use(express.json())

// Route files
const giftRoutes = require('./routes/giftRoutes')
const searchRoutes = require('./routes/searchRoutes')
const authRoutes = require('./routes/authRoutes')

const pinoHttp = require('pino-http')
const logger = require('./logger')

app.use(pinoHttp({ logger }))

// Use Routes
app.use('/api/gifts', giftRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/auth', authRoutes)

// Global error handler
app.use((error, request, response, next) => {
    console.error(error.message)
    response.status(500).send('Internal Server Error')
})

app.get('/', (request, response) => {
    response.status(200).send('Inside the server')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
