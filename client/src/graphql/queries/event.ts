import { gql } from "@apollo/client";

export const EVENTQUERY = gql`
    query Query($id: ID!){
    event (id: $id){
        name
        organizatorId
        membersRestrictions
        maxMembers
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
    
    
    }
    }
`;
