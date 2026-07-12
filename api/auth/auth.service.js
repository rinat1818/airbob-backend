import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { userService } from '../user/user.service.js'

const cryptr = new Cryptr(process.env.SECRET || 'Secret-Puk-1234')

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken,
}
async function login(username, password) {
    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')

    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    user._id = user._id.toString()
    return user
}

// async function login(username, password) {
//     const user = await userService.getByUsername(username)
//     if (!user) return Promise.reject('Invalid username or password')

//     const match = await bcrypt.compare(password, user.password)
//     if (!match) return Promise.reject('Invalid username or password')

//     delete user.password
//     user._id = user._id.toString()
//     return user
// }

async function signup({ username, password, fullname, imgUrl, isAdmin }) {
    const saltRounds = 10
    if (!username || !password || !fullname) return Promise.reject('Missing required signup information')

    const userExist = await userService.getByUsername(username)
    if (userExist) return Promise.reject('Username already taken')

    console.log('hashing password...')
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('adding user...')
    const result = await userService.add({ username, password: hash, fullname, imgUrl, isAdmin })
    console.log('user added:', result)
    return result
}

function getLoginToken(user) {
    const userInfo = {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    }
    return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}
