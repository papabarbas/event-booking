import mongoose from 'mongoose'

const Schema = mongoose.Schema

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)

const EventModel = mongoose.model('Event', eventSchema)

export default EventModel
