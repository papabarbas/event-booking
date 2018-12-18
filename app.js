import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import EventModel from './models/Event'
import UserModel from './models/User'

const app = express()
const PORT = process.env.PORT

// Fix ObjectId type

const { ObjectId } = mongoose.Types
ObjectId.prototype.valueOf = function() {
  return this.toString()
}
// ->

app.use(express.json())
app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(/* GraphQL */ `
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Int!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        event(id: ID!): Event
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      event: async ({ id }) => {
        const event = await EventModel.findById(id).populate('creator', 'email')
        console.log(event)
        return event
      },
      events: async () => {
        const events = EventModel.find()
        return events
      },
      createEvent: async ({ eventInput }) => {
        const eventData = {
          ...eventInput,
          creator: '5c18112336a4c21524004eb5'
        }
        const event = await EventModel.create(eventData).catch(err => {
          throw new Error(error)
        })
        await UserModel.findByIdAndUpdate('5c18112336a4c21524004eb5', {
          $push: { createdEvents: event._id }
        })
        return event
      },
      createUser: async ({ userInput: { email, password } }) => {
        try {
          const hashedPass = await bcrypt.hash(password, 10)
          const user = await UserModel.create({
            email,
            password: hashedPass
          })
          console.log({ ...user.doc })
          return { ...user._doc, password: null }
        } catch (error) {
          throw new Error(error.errmsg)
        }
      }
    },

    Event: {
      _id: parent => {
        console.log(parent._id.toString())
        return parent._id.toString()
      }
    }
  })
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_HOST}`,
    {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
      dbName: process.env.MONGODB_DATABASE,
      useNewUrlParser: true
    }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch(err => console.log(err))
