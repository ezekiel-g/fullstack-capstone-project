router.get('/', async (request, response) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        // const db = {{insert code here}}

        // Task 2: use the collection() method to retrieve the gift collection
        // {{insert code here}}

        // Task 3: Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
        // const gifts = {{insert code here}}

        // Task 4: return the gifts using the response.json method
        response.json(/* {{insert code here}} */)
    } catch (error) {
        console.error('Error fetching gifts:', error)
        response.status(500).send('Error fetching gifts')
    }
})

router.get('/:id', async (request, response) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        // const db = {{insert code here}}

        // Task 2: use the collection() method to retrieve the gift collection
        // {{insert code here}}

        const id = request.params.id

        // Task 3: Find a specific gift by ID using the collection.fineOne method and store in constant called gift
        // {{insert code here}}

        if (!gift) {
            return response.status(404).send('Gift not found')
        }

        response.json(gift)
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
