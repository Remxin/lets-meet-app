import { gql } from "@apollo/client";

export const OPINIONSQUERY = gql`
 query Query($placeId: String) {
  placeOpinions(placeId: $placeId) {
    user {
      name
      id
      premium
    }
    comment
    stars
  }
}
`