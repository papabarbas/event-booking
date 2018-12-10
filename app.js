import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();
const PORT = process.env.PORT;

const events = [];

app.use(express.json());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
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
        price: Float!
      }

      type RootQuery{
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
      events: (parent, args, context, info) => events,
      createEvent: ({ eventInput: { title, description, price } }) => {
        const event = {
          _id: Math.random().toString(),
          title,
          price,
          description,
          date: new Date().toISOString()
        };
        events.push(event);
        return event;
      }
    }
  })
);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
