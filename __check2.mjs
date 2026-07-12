import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const client = await MongoClient.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 8000 })
const db = client.db(process.env.DB_NAME)

for (const name of ['user', 'users']) {
  const doc = await db.collection(name).findOne({})
  console.log(`\n--- ${name} sample keys ---`)
  if (doc) {
    for (const [k, v] of Object.entries(doc)) {
      console.log(`  ${k}: ${typeof v}${Array.isArray(v) ? ' (array)' : ''}`)
    }
  } else {
    console.log('  (empty)')
  }
}

await client.close()
