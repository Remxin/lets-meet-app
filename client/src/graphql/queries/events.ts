import { gql } from "@apollo/client";

export const EVENTSQUERY = gql`
  query Query ($userId: ID, $eventsType: String){
    events (userId: $userId, eventsType: $eventsType){
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
      membersRestrictions
      date
      imageSrc
      cityObj {
        name
      }
      placeObj {
        name
      }
    }
  }
`;
