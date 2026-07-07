import express from 'express'
import { ObjectId } from 'mongodb'
import { dbService } from '../services/db.service.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const collection = await dbService.getCollection('stays')
        const stays = await collection.find().toArray()
        res.json(stays)
    } catch (err) {
        res.status(500).json({ error: 'Failed to get stays' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const collection = await dbService.getCollection('stays')
        const stay = await collection.findOne({ _id: req.params.id })
        res.json(stay)
    } catch (err) {
        res.status(500).json({ error: 'Failed to get stay' })
    }
})

router.post('/', async (req, res) => {
    try {
        const collection = await dbService.getCollection('stays')
        const result = await collection.insertOne(req.body)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: 'Failed to create stay' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const collection = await dbService.getCollection('stays')
        const result = await collection.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        )
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: 'Failed to update stay' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const collection = await dbService.getCollection('stays')
        const result = await collection.deleteOne({ _id: req.params.id })
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete stay' })
    }
})

export default router