// export default {
//   dbURL: 'mongodb://127.0.0.1:27017',
//   dbName: 'stay_db'
// }


// export default {
//   dbURL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
//   dbName: process.env.DB_NAME || 'stay_db'
// }

// console.log('dbURL:', process.env.MONGO_URL)


import dotenv from 'dotenv'
dotenv.config()
console.log('MONGO_URL:', process.env.MONGO_URL)

export default {
  dbURL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
 dbName: process.env.DB_NAME || 'stay_db_atlas'
}