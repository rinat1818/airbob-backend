import express from 'express'

const router = express.Router()

// GET all stays
router.get('/', (req, res) => {
    res.json([])
})

// GET stay by id
router.get('/:id', (req, res) => {
    res.json({})
})

// POST create stay
router.post('/', (req, res) => {
    res.json({})
})

// PUT update stay
router.put('/:id', (req, res) => {
    res.json({})
})

// DELETE stay
router.delete('/:id', (req, res) => {
    res.json({})
})

export default router