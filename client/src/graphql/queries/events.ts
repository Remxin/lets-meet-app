import { gql } from "@apollo/client";

export const EVENTSQUERY = gql`
  query Query {
    events {
      id
      name
      organizatorId
      organizator {
        name
        email
      }
      premium
      public
      place
      city
      members
      membersRestrictions
    }
  }
`;
