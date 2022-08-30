export type placesArgsType = {
    verified: Boolean
}

export type eventArgsType = {
    id: String
}

export type singlePlaceArgsType = {
    verified: Boolean,
    id: String
}

export type myEventsArgsType = {
    userId?: string
    eventsType: "myevents" | "joinedEvents"
}

export type placeOpinionsArgsType = {
    placeId: string
}
