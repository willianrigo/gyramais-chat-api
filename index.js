// index.js
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");

const serviceAccount = require("./credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://graphql-test-f4474.firebaseio.com"
});

const { ApolloServer, gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Message {
    author: String
    avatarId: Int
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
    addMessage(data: String, timestamp: String,
      author: String, avatarId: Int): Message

    addUser(name: String, avatarId: Int, token: String): User
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
        return(
        admin.database().ref('messages/').push({
          data: args.data,
          author: args.author,
          avatarId: args.avatarId,
          timestamp : args.timestamp
        }))
      },
      addUser: (root, args) => {
        return(
        admin.database().ref('users/').push({
          name: args.name,
          avatarId: args.avatarId,
          token : args.token
        }))
      }
  }
}

// setup express cloud function
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/", cors: true });

exports.graphql = functions.https.onRequest(app);