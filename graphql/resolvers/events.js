import EventModel from '../../models/Event'
import UserModel from '../../models/User'
import { getEventCreator } from './merge'

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
  events: async (args, req) => {
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
  createEvent: async ({ eventInput }, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated')
    }
    try {
      const eventData = { ...eventInput, creator: req.userId }
      const event = await EventModel.create(eventData)
      const creator = await UserModel.findByIdAndUpdate(
        req.userId,
        { $push: { createdEvents: event._id } },
        { select: '_id', new: true }
      )

      const createdEvent = {
        ...event._doc,
        creator: getEventCreator.bind(this, creator._id)
      }
      return createdEvent
    } catch (error) {
      throw error
    }
  }
}
