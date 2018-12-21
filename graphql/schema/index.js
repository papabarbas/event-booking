import { buildSchema } from 'graphql'
const schema = buildSchema(/* GraphQL */ `
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  input EventInput {
    title: String!
    description: String!
    price: Int!
    date: String!
  }

  type User {
    _id: ID!
    email: String
    createdEvents: [Event!]
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    event(id: ID!): Event
    events: [Event!]!
    users: [User!]!
  }

  type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)

export default schema
