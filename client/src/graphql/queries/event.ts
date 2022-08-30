import { gql } from "@apollo/client";

export const EVENTQUERY = gql`
    query Query($id: ID!){
    event (id: $id){
        name
        organizatorId
        membersRestrictions
        maxMembers
        description
        membersRestrictions
        public
        premium
        date
        placeObj {
            id
            name
            localizationString
            opinionStars
        }
       
        cityObj {
            name
        }
        organizator {
            age
            name
            sex
            premium
            id
        }
        members {
            name
            age
            sex
            id
            premium
        }
        imageSrc
    
    }
    }
`;
