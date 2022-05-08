import { gql } from "@apollo/client";

export const EVENTSQUERY = gql`
  query Query {
    events {
      id
      name
      organizatorId
      maxMembers
      members {
        name
      }
      organizator {
        name
        email
      }
      premium
      public
      place
      city
      membersRestrictions
    }
  }
`;
