import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    test: String!
    events: [Event]
    event(id: ID!): Event
  }
  type Event {
    id: ID!
    name: String!
    organizatorId: String
    organizator: User
    members: [String!]
    premium: Boolean!
    public: Boolean!
    place: String!
    city: String!
    description: String!
    membersRestrictions: [String]
    chatId: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    sex: String!
    age: Int!
    myEvents: [ID]
    joinedEvents: [ID]
    premium: Boolean!
    role: String!
    promotionEvents: Int!
  }
`;
