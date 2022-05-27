import React, {useState} from 'react'
import {useQuery} from "@apollo/client"
import { EVENTQUERY } from '../queries/event'
import { Switch } from '@nextui-org/react'
import { FaUsers } from "react-icons/fa";

import OrganizatorCard from '../../components/pages/eventCardComp/OrganizatorCard'
import MemberCard from '../../components/pages/eventCardComp/MemberCard'
import userDataHelper from '../../helpers/userData'
import "../../styles/scss/apolloComponents/Event.scss"

type userType = {
    name: String,
    age: Number,
    premium: Boolean,
    id: String,
    sex: String
}
// type eventProps = {
//     id: String;
//     name: String;
//     organizatorId: String;
//     organizator: userType
//     premium: Boolean;
//     public: Boolean;
//     place: String;
//     city: String;
//     members: userType[];
//     membersRestrictions: String[];
//   };


  type queryProps = {
      eventId: String
  }

const EventQuery = ({eventId}: queryProps) => {
    const [showMembers, setShowMembers] = useState(false)
    const { loading, error, data } = useQuery(EVENTQUERY, {
        variables: {id: eventId}
    });
  
    if (loading)
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    if (error)
      return (
        <div>
          <p>Error: </p>
        </div>
      );
        console.log(data.event)
      return (
          <div>
              <h2>{userDataHelper.capitalize(data.event.name)}</h2>
              <h4>Organizator: </h4>
              <OrganizatorCard id={data.event.organizator.id} name={data.event.organizator.name} age={data.event.organizator.age} premium={data.event.organizator.premium} sex={data.event.organizator.sex}/>
              <h4>Members: {data.event.members.length}{data.event.maxMembers !== -1 ? `/${data.event.maxMembers}` : null}</h4>
              <p>Show members:  </p>
              <Switch checked={false} color="warning" shadow bordered icon={<FaUsers/>} onChange={() => setShowMembers(!showMembers)}/>
              {showMembers ? (
              <div className='members-card__container'>
                {data.event.members.map((member: userType) => {
                  return <MemberCard id={member.id} name={member.name} sex={member.sex} age={member.age} premium={member.premium}/>
                })}
              </div>
              ) : null}
              

          </div>
      )
}

export default EventQuery