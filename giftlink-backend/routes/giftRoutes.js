router.get('/', async (request, response) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase()

        // Task 2: use the collection() method to retrieve the gift collection
        const collection = db.collection('gifts')

        // Task 3: Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
        const gifts = await collection.find({}).toArray()

        // Task 4: return the gifts using the response.json method
        response.status(200).json(gifts)
    } catch (error) {
        console.error('Error fetching gifts:', error)
        response.status(500).send('Error fetching gifts')
    }
})

router.get('/:id', async (request, response) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase()

        // Task 2: use the collection() method to retrieve the gift collection
        const collection = db.collection('gifts')

        const id = request.params.id

        // Task 3: Find a specific gift by ID using the collection.fineOne method and store in constant called gift
        const gift = await collection.findOne({ id: id })

        if (!gift) {
            return response.status(404).send('Gift not found')
        }

        response.status(200).json(gift)
    } catch (error) {
        console.error('Error fetching gift:', error)
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
