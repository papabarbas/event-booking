import express from 'express'
import graphqlHTTP from 'express-graphql'

import mongoose from 'mongoose'

import schema from './graphql/schema'
import rootValue from './graphql/resolvers'

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
    graphiql: true,
    rootValue,
    schema
  })
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_HOST}`,
    {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
      dbName: process.env.MONGODB_DATABASE,
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch(err => console.log(err))
