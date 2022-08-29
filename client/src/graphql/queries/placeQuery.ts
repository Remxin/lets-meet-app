import { gql } from "@apollo/client"

export const PLACEQUERY = gql`
  query Query($placeId: ID!, $verified: Boolean ) {
    place(id: $placeId, verified: $verified) {
      user {
        name
        email
      }
      premium
      website
      localizationString
      opinionStars
      name
      city {
        state
        name
        country
      }
      description
      id
    }
  }
`