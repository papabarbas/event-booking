import BookingModel from '../../models/Booking'
import EventModel from '../../models/Event'
import { transformBooking } from './merge'
export default {
  booking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated')
    }
    const booking = await BookingModel.findById(bookingId)
      .populate('event')
      .populate({ path: 'user', select: '-password' })
    return booking
  },
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated')
    }
    const booking = await BookingModel.find()
      .populate('event')
      .populate({ path: 'user', select: '-password' })
    return booking
  },
  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated')
    }
    const fetchedEvent = await EventModel.findById(eventId)
    if (!fetchedEvent) {
      throw new Error('Event does not exists')
    }
    const bookingData = {
      user: req.userId,
      event: fetchedEvent._id
    }
    if (await BookingModel.findOne(bookingData)) {
      throw Error('Already booked')
    }

    const booking = await BookingModel.create(bookingData)

    const returnedBooking = await transformBooking(booking)

    console.log({ returnedBooking })

    return returnedBooking
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error('unauthenticated')
    }
    const deletedBooking = await BookingModel.findByIdAndDelete(
      bookingId
    ).populate('event')
    return deletedBooking.event
  }
}
