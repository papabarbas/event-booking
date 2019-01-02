import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../../models/User'
import { getCreatedEvents } from './merge'

export default {
  users: async () => {
    try {
      const users = await UserModel.find().select('-password')
      const userWithCreatedEvents = users.map(user => {
        return {
          ...user._doc,
          createdEvents: getCreatedEvents.bind(this, user.createdEvents)
        }
      })
      console.log(users)
      return userWithCreatedEvents
    } catch (error) {
      throw error
    }
  },
  createUser: async ({ userInput: { email, password } }) => {
    try {
      const hashedPass = await bcrypt.hash(password, 10)
      const user = await UserModel.create({
        email,
        password: hashedPass
      })
      delete user._doc.password
      console.log(user)
      return user
    } catch (error) {
      throw error
    }
  },
  login: async ({ email, password }) => {
    const user = await UserModel.findOne({ email })
    if (!user) return new Error('Invalid credentials')
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return new Error('invalid credentials')
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )

    return {
      userId: user._id,
      token,
      tokenExpiration: 1
    }
  }
}
