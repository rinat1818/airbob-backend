import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const client = await MongoClient.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 8000 })
console.log('Connected OK\n')

const admin = client.db().admin()
const { databases } = await admin.listDatabases()

for (const dbInfo of databases) {
  if (['admin', 'local', 'config'].includes(dbInfo.name)) continue
  const db = client.db(dbInfo.name)
  const cols = await db.listCollections().toArray()
  console.log(`DB "${dbInfo.name}":`)
  for (const c of cols) {
    const count = await db.collection(c.name).countDocuments()
    console.log(`  - ${c.name}: ${count} docs`)
  }
}

await client.close()
