import express from 'express'
import { getUserCollection } from '../services/userCollection.service.js'

const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ error: 'Missing username or password' })
        }

        const collection = await getUserCollection()
        const user = await collection.findOne({ username, password })
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }
        res.json(user)
    } catch (err) {
        console.error('Login failed', err)
        res.status(500).json({ error: 'Login failed' })
    }
})

router.post('/signup', async (req, res) => {
    try {
        const { fullname, username, password } = req.body
        if (!fullname || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const collection = await getUserCollection()
        const existing = await collection.findOne({ username })
        if (existing) {
            return res.status(400).json({ error: 'Username already taken' })
        }

        const imgUrl = req.body.imgUrl || `https://robohash.org/${username}?set=set5`
        const user = { fullname, username, password, imgUrl, isHost: false, trips: [] }
        const result = await collection.insertOne(user)
        res.json({ ...user, _id: result.insertedId })
    } catch (err) {
        console.error('Signup failed', err)
        res.status(500).json({ error: 'Signup failed' })
    }
})

router.post('/logout', (req, res) => {
    res.json({ msg: 'Logged out' })
})

export default router
