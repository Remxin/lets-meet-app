export type placeType = {
    _id?: String
    id: String
    addressString: String
    name: String
    localizationString: String
    premium: Boolean
    website: String
    description: String
    opinionStars: Number
    userId?: String
    verified: Boolean
    cityId?: String
    user?: userType
    city?: cityType
}

export type userType = {
    id: String
    name: String
      email: String
      password: String
      sex: String
      age: Number
      myEvents: String[]
      joinedEvents: String[]
      premium: Boolean
      role: String
      promotionEvents: Number
      myEventsArr?: eventType[]
      joinedEventsArr?: eventType[]
}

export type eventType = {
    id:String
    name: String
      organizatorId: String
      organizator?: userType
      members: String[] | userType[]
      premium: Boolean
      public: Boolean
      membersRestrictions: String[]
      place: String
      city: String
      description: String
      chatId: String
      maxMembers: Number
      date: Number
      imageSrc: string
}

export type cityType = {
    _id?: String
    id?: String
    name: String
    country: String
    localizationString: String
    state: String
}

export type chatType = {
    id:String
    organizatorId: String
      members: String[] | userType[]
      messages: messageType[]
      open: Boolean
}

export type messageType = {
    user: userType
    text: String
}

export type opinionType = {
    id: String
    placeId: String
    place?: placeType
    stars: Number
    comment: String
    userId: String
    user?: userType
}

export type errorType = {
    id: String
    source: "server" | "user reported"
    type: String
    text: String
}

