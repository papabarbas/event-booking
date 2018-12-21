import bcrypt from 'bcryptjs'

import EventModel from '../../models/Event'
import UserModel from '../../models/User'

const getCreatedEvents = async eventsIds => {
  try {
    const eventsArray = await EventModel.find({ _id: { $in: eventsIds } })
    const updatedArray = eventsArray.map(event => {
      return {
        ...event._doc,
        creator: getEventCreator.bind(this, event._doc.creator)
      }
    })
    return updatedArray
  } catch (error) {
    throw error
  }
}

const getEventCreator = async userId => {
  try {
    const nuser = await UserModel.findById(userId, '-password')
    const newUser = {
      ...nuser._doc,
      createdEvents: getCreatedEvents.bind(this, nuser._doc.createdEvents)
    }
    return newUser
  } catch (err) {
    throw err
  }
}
export default {
  event: async ({ id }) => {
    try {
      const event = await EventModel.findById(id)
      const eventResolved = {
        ...event._doc,
        creator: getEventCreator.bind(this, event.creator)
      }
      return eventResolved
    } catch (error) {
      throw error
    }
  },
  events: async () => {
    try {
      const queriedEvents = await EventModel.find()
      const transformedArray = queriedEvents.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          creator: getEventCreator.bind(this, event._doc.creator)
        }
      })
      console.log(transformedArray)
      return transformedArray
    } catch (error) {}
  },

  createEvent: async ({ eventInput }) => {
    try {
      const eventData = { ...eventInput, creator: '5c1d2777becf2f0a6f152d36' }
      const event = await EventModel.create(eventData)
      const creator = await UserModel.findByIdAndUpdate(
        '5c1d2777becf2f0a6f152d36',
        { $push: { createdEvents: event._doc._id } },
        { select: '_id', new: true }
      )

      const createdEvent = {
        ...event._doc,
        creator: getEventCreator.bind(this, '5c1d2777becf2f0a6f152d36')
      }
      return createdEvent
    } catch (error) {
      throw error
    }
  },
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
  }
}
