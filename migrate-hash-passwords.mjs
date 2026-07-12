// One-time migration: hash any plaintext passwords in the 'users' collection
// with bcrypt, so they work with the real auth system's bcrypt.compare().
// Safe to run more than once — already-hashed passwords are detected and skipped.
//
// Run after `git pull` + `npm install` (needs bcrypt installed):
//   node migrate-hash-passwords.mjs

import 'dotenv/config'
import bcrypt from 'bcrypt'
import { dbService } from './services/db.service.js'

const SALT_ROUNDS = 10
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/

async function migrate() {
    const collection = await dbService.getCollection('users')
    const users = await collection.find({}).toArray()

    console.log(`Found ${users.length} user(s) in the 'users' collection.\n`)

    let updated = 0
    let skipped = 0

    for (const user of users) {
        const label = user.username || user._id

        if (typeof user.password !== 'string' || !user.password) {
            console.log(`⚠ ${label}: no password field, skipping`)
            skipped++
            continue
        }

        if (BCRYPT_HASH_PATTERN.test(user.password)) {
            console.log(`- ${label}: already hashed, skipping`)
            skipped++
            continue
        }

        const hash = await bcrypt.hash(user.password, SALT_ROUNDS)
        await collection.updateOne({ _id: user._id }, { $set: { password: hash } })
        console.log(`✓ ${label}: password hashed and updated`)
        updated++
    }

    console.log(`\nDone. ${updated} updated, ${skipped} skipped.`)
    process.exit(0)
}

migrate().catch(err => {
    console.error('Migration failed:', err)
    process.exit(1)
})
