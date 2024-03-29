import { gql } from "apollo-server-express";


export const typeDefs = gql`
  type Query {
    test: String!
    events(userId: ID, eventsType: String): [Event]
    event(id: ID!): Event
    places(verified: Boolean): [Place]
    cities: [City]
    place(verified: Boolean, id: ID!): Place
    placeOpinions(placeId: String): [PlaceOpinion]
    # cities(country: String)
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
    placeObj: Place
    city: String!
    cityObj: City
    description: String!
    membersRestrictions: [String]
    chatId: ID!
    chat: Chat
    maxMembers: Int!
    date: Float!
    imageSrc: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    sex: String!
    age: Float!
    myEvents: [ID]
    myEventsArr: [Event]
    joinedEvents: [ID]
    joinedEventsAr: [Event]
    premium: Boolean!
    role: String!
    promotionEvents: Int!
  }

  type Place {
    id: ID!
    name: String!
    localizationString: String
    premium: Boolean!
    website: String
    description: String
    opinionStars: Float!
    user: User
    verified: Boolean!
    city: City
  }

  type City {
    id: ID!
    name: String!
    country: String!
    localizationString: String!
    state: String
  }

  type Chat {
    # organizatorId: ID!
    organizator: User
    members: [User]
    messages: [Message]
    open: Boolean
  }

  type Message {
    user: User
    text: String
  }

  type PlaceOpinion {
    place: Place
    stars: Float
    comment: String
    user: User
  }
`;
