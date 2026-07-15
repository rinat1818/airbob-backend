import express from 'express'
import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'

const router = express.Router()

async function findBookingQuery(collection, id) {
    let booking = await collection.findOne({ _id: id })
    if (booking) return { _id: id }
    if (ObjectId.isValid(id)) {
        booking = await collection.findOne({ _id: new ObjectId(id) })
        if (booking) return { _id: new ObjectId(id) }
    }
    return null
}

router.get('/', async (req, res) => {
    try {
        const collection = await dbService.getCollection('bookings')
        const criteria = {}
        if (req.query.userId) criteria.userId = req.query.userId
        if (req.query.hostId) criteria.hostId = req.query.hostId

        const bookings = await collection.find(criteria).toArray()
        res.json(bookings)
    } catch (err) {
        res.status(500).json({ error: 'Failed to get bookings' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const collection = await dbService.getCollection('bookings')
        let booking = await collection.findOne({ _id: req.params.id })
        if (!booking && ObjectId.isValid(req.params.id)) {
            booking = await collection.findOne({ _id: new ObjectId(req.params.id) })
        }
        res.json(booking)
    } catch (err) {
        res.status(500).json({ error: 'Failed to get booking' })
    }
})

router.post('/', async (req, res) => {
    try {
        const collection = await dbService.getCollection('bookings')
        const result = await collection.insertOne(req.body)
        res.json({ ...req.body, _id: result.insertedId })
    } catch (err) {
        res.status(500).json({ error: 'Failed to create booking' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const collection = await dbService.getCollection('bookings')
        const idQuery = await findBookingQuery(collection, req.params.id)
        if (!idQuery) return res.status(404).json({ error: 'Booking not found' })

        await collection.updateOne(idQuery, { $set: req.body })
        res.json({ ...req.body, _id: idQuery._id })
    } catch (err) {
        res.status(500).json({ error: 'Failed to update booking' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const collection = await dbService.getCollection('bookings')
        const idQuery = await findBookingQuery(collection, req.params.id)
        if (!idQuery) return res.status(404).json({ error: 'Booking not found' })

        const result = await collection.deleteOne(idQuery)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete booking' })
    }
})

export default router