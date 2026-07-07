import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'

var dbConn = null

export const dbService = { getCollection }

async function getCollection(collectionName) {
    const db = await _connect()
    return db.collection(collectionName)
}

async function _connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL)
        return dbConn = client.db(config.dbName)
    } catch (err) {
        console.error('Cannot connect to DB', err)
        throw err
    }
}