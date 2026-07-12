import express from 'express'
import { getUserCollection } from '../services/userCollection.service.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const collection = await getUserCollection()
        const users = await collection.find().toArray()
        res.json(users)
    } catch (err) {
        console.error('Failed to get users', err)
        res.status(500).json({ error: 'Failed to get users' })
    }
})

export default router
