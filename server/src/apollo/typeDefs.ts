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
    members: [User]
    premium: Boolean!
    public: Boolean!
    place: String! 
    city: String!
    description: String!
    membersRestrictions: [String]
    chatId: ID!
    maxMembers: Int!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    sex: String!
    age: Float!
    myEvents: [ID]
    joinedEvents: [ID]
    premium: Boolean!
    role: String!
    promotionEvents: Int!
  }
`;
