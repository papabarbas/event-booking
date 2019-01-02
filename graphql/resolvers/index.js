import auth from './auth'
import bookings from './bookings'
import events from './events'

const rootValue = {
  ...auth,
  ...bookings,
  ...events
}

export default rootValue
