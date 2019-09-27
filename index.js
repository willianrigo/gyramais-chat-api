// index.js
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");

const serviceAccount = require("./graphql-test-f4474-firebase-adminsdk-az4wy-9f11fde5e3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://graphql-test-f4474.firebaseio.com"
});

const { ApolloServer, gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Message {
    author: String
    data: String
    timestamp: String
  }
  type User{
    name: String
    avatarId: String
    token: String
  }
  type Query {
    messages: [Message]
    users: [User]
  }
  type Mutation{
    addMessage(data: String!, timestamp: String!,
      author: String!, messageId: Int!): Message
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    messages: () =>
      admin
        .database()
        .ref("messages")
        .once("value")
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key])),

    users: () =>
      admin
        .database()
        .ref("users")
        .once("value")
        .then(snap => snap.val())
        .then(val => Object.keys(val).map(key => val[key]))
    },
    Mutation: {
      addMessage: (root, args) => {
        admin.database().ref('messages/' + args.messageId).set({
          data: args.data,
          author: args.author,
          timestamp : args.timestamp
        });
      }
  }
}
// setup express cloud function
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/", cors: true });

exports.graphql = functions.https.onRequest(app);