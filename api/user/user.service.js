import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'

export const userService = {
    add,
    getById,
    update,
    remove,
    query,
    getByUsername,
}

async function query() {
    try {
        const collection = await dbService.getCollection('users')
        let users = await collection.find().toArray()
        users = users.map(user => {
            delete user.password
            return user
        })
        return users
    } catch (err) {
        console.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('users')
        const user = await collection.findOne({ _id: new ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        console.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('users')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        console.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('users')
        await collection.deleteOne({ _id: new ObjectId(userId) })
    } catch (err) {
        console.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const userId = new ObjectId(user._id)
        const collection = await dbService.getCollection('users')

        // Only touch fields that were actually sent, so a partial update
        // (e.g. just isHost + stays from "Become a Host") can't wipe out
        // other fields by setting them to undefined.
        const fieldsToUpdate = {}
        if (user.fullname !== undefined) fieldsToUpdate.fullname = user.fullname
        if (user.imgUrl !== undefined) fieldsToUpdate.imgUrl = user.imgUrl
        if (user.isHost !== undefined) fieldsToUpdate.isHost = user.isHost
        if (user.stays !== undefined) fieldsToUpdate.stays = user.stays

        await collection.updateOne({ _id: userId }, { $set: fieldsToUpdate })

        // Return the full saved user (not just the fields we touched) so
        // the frontend doesn't clobber its in-memory user with a partial
        // object.
        const savedUser = await collection.findOne({ _id: userId })
        delete savedUser.password
        return savedUser
    } catch (err) {
        console.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            isAdmin: user.isAdmin || false,
        }
        const collection = await dbService.getCollection('users')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        console.error('cannot add user', err)
        throw err
    }
}