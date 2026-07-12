import { dbService } from './db.service.js'

// Your Atlas cluster has two similarly-named collections ('user' and
// 'users') left over from earlier experiments. Rather than hardcoding a
// guess, check both once, use whichever actually holds documents shaped
// like a user (has a 'username' field), and cache that choice so we're
// not re-checking on every request.
let cachedCollectionName = null

export async function getUserCollection() {
    if (cachedCollectionName) {
        return dbService.getCollection(cachedCollectionName)
    }

    for (const name of ['users']) {
        const collection = await dbService.getCollection(name)
        const sample = await collection.findOne({})
        if (sample && 'username' in sample) {
            cachedCollectionName = name
            console.log(`[userCollection] using "${name}" as the user collection`)
            return collection
        }
    }

    // Neither collection has a recognizable user doc yet (e.g. both
    // empty) — default to 'user' so signup has somewhere to write to.
    cachedCollectionName = 'user'
    console.log('[userCollection] no existing user data found, defaulting to "user"')
    return dbService.getCollection('user')
}
