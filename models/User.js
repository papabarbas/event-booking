import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },

    createdEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }
    ]
  },
  { timestamps: true }
)

const UserModel = mongoose.model('User', userSchema)

export default UserModel
