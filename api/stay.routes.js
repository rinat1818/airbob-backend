import express from 'express'
import { ObjectId } from 'mongodb'
import { dbService } from '../services/db.service.js'

const router = express.Router()

// New stays get a real MongoDB ObjectId for _id (nothing sent in the
// request), while the original seeded stays have plain string _ids.
// This finds either kind by a given :id param.
async function findStayQuery(collection, id) {
    let stay = await collection.findOne({ _id: id })
    if (stay) return { _id: id }
    if (ObjectId.isValid(id)) {
        stay = await collection.findOne({ _id: new ObjectId(id) })
        if (stay) return { _id: new ObjectId(id) }
    }
    return null
}

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
        let stay = await collection.findOne({ _id: req.params.id })
        if (!stay && ObjectId.isValid(req.params.id)) {
            stay = await collection.findOne({ _id: new ObjectId(req.params.id) })
        }
        res.json(stay)
    } catch (err) {
        res.status(500).json({ error: 'Failed to get stay' })
    }
})

router.post('/', async (req, res) => {
    try {
        const collection = await dbService.getCollection('stays')
        const result = await collection.insertOne(req.body)
        // Return the actual saved stay (with its _id), not the raw
        // insertOne() result — the frontend relies on savedStay._id.
        res.json({ ...req.body, _id: result.insertedId })
    } catch (err) {
        res.status(500).json({ error: 'Failed to create stay' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const collection = await dbService.getCollection('stays')
        const idQuery = await findStayQuery(collection, req.params.id)
        if (!idQuery) return res.status(404).json({ error: 'Stay not found' })

        await collection.updateOne(idQuery, { $set: req.body })
        // Same as POST — return the saved stay itself, not the raw
        // updateOne() result.
        res.json({ ...req.body, _id: idQuery._id })
    } catch (err) {
        res.status(500).json({ error: 'Failed to update stay' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const collection = await dbService.getCollection('stays')
        const idQuery = await findStayQuery(collection, req.params.id)
        if (!idQuery) return res.status(404).json({ error: 'Stay not found' })

        const result = await collection.deleteOne(idQuery)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete stay' })
    }
})

export default router
