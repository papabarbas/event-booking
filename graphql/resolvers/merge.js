import EventModel from '../../models/Event'
import UserModel from '../../models/User'

export const getCreatedEvents = async eventsIds => {
  try {
    const eventsArray = await EventModel.find({ _id: { $in: eventsIds } })
    return eventsArray.map(event => {
      return {
        ...event._doc,
        creator: getEventCreator.bind(this, event._doc.creator)
      }
    })
  } catch (error) {
    throw error
  }
}

export const getEventCreator = async userId => {
  try {
    const user = await UserModel.findById(userId, '-password')
    const eventCreator = {
      ...user._doc,
      createdEvents: getCreatedEvents.bind(this, user.createdEvents)
    }
    return eventCreator
  } catch (err) {
    throw err
  }
}
const transformEvent = event => {
  return {
    ...event._doc,
    creator: getEventCreator.bind(this, event.creator)
  }
}
const singleEvent = async eventId => {
  try {
    const event = await EventModel.findById(eventId)
    return transformEvent(event)
  } catch (err) {
    throw err
  }
}
export const transformBooking = async booking => {
  return {
    ...booking._doc,
    user: getEventCreator.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event)
  }
}
