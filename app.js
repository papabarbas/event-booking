import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import mongoose from 'mongoose'

import EventModel from './models/Event'

const app = express()
const PORT = process.env.PORT

/// Fix ObjectId type
const { ObjectId } = mongoose.Types
ObjectId.prototype.valueOf = function() {
  return this.toString()
}
/// ->

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
      }

      input EventInput {
        title: String!
        description: String!
        price: Int!
        date: String!
      }

      type RootQuery {
        event(id: ID!): Event
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      event: async ({ id }) => {
        const event = await EventModel.findById(id)
        console.log(event)
        return event
      },
      events: async () => {
        const events = EventModel.find()
        return events
      },
      createEvent: async ({ eventInput }) => {
        const event = await EventModel.create(eventInput).catch(err => {
          throw new Error(error)
        })
        return event
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
