import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import stayRoutes from './api/stay.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3030

app.use(cors())
app.use(express.json())

app.use('/api/stay', stayRoutes)

app.get('/', (req, res) => {
    res.send('Airbob server is running!')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})