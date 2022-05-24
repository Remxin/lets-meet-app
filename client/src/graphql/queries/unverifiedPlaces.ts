import { gql } from "@apollo/client";

export const UNVERIFIEDPLACESQUERY = gql`
query Query ($verified: Boolean!){
  places (verified: $verified){
      id
      name
      user {
        name
        age
        premium
      }
      city {
        name
        localizationString
        country
        state
      }
      verified
    localizationString
    website
    description
  }
    
  }
`;
