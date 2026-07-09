import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import stayRoutes from './api/stay.routes.js'
import path from 'path'
import { authRoutes } from './api/auth/auth.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3030

app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
         origin: [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174'
    ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.use('/api/stay', stayRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Airbob server is running!')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        console.log('looking for username:', username)
        const user = await collection.findOne({ username })
        console.log('found user:', user)
        return user
    } catch (err) {
        console.error(`while finding user by username: ${username}`, err)
        throw err
    }
}