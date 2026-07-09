import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import stayRoutes from './api/stay.routes.js'

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

app.get('/', (req, res) => {
    res.send('Airbob server is running!')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
