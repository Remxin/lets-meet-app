import React, { useState, useContext } from 'react'
import {useQuery} from "@apollo/client"
import { EVENTQUERY } from '../queries/event'
import { Switch } from '@nextui-org/react'
import { FaUsers } from "react-icons/fa";

import UserAvatar from '../../modules/UserAvatar';
import MemberCard from '../../components/pages/eventCardComp/MemberCard'
import PlaceCard from '../../modules/PlaceCard';
import GoogleMaps from '../../modules/GoogleMaps';
import ConfirmationModal from '../../modules/ConfirmationModal';
import InformationModal from '../../modules/InformationModal';

import userDataHelper from '../../helpers/userData'
import "../../styles/scss/apolloComponents/Event/Event.scss"
import "../../styles/scss/apolloComponents/Event/576.scss"
import "../../styles/scss/apolloComponents/Event/769.scss"

import { UserContext } from '../../contexts/UserContext'
import { useNavigate } from "react-router-dom"

import { joinEvent } from "../../api/event/joinEvent"

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
      eventId: string
  }

const EventQuery = ({eventId}: queryProps) => {
    //@ts-ignore
    const { user } = useContext(UserContext)
    const [showMembers, setShowMembers] = useState(false)
    const [userWantJoin, setUserWantJoin] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [successText, setSuccessText] = useState("")
    const navigate = useNavigate()

    


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
        console.log(data.event.imageSrc)

      async function startJoiningEvent() {
        setErrorText("")
        setSuccessText("")
        const res = await joinEvent(eventId)
        console.log(res);
        
        //@ts-ignore
        if (res.err) {
          //@ts-ignore
          setErrorText(res.err)
        } 
        //@ts-ignore
        if (res.msg) {
          console.log(res);
          //@ts-ignore
          setSuccessText(res.msg)
        }
        setShowConfirmationModal(true)
        
      }
      return (
          <div className='event-page-container' style={{
            background: `url("${data.event.imageSrc}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}>
            <div className="event-page-content">
              <h2 className="event-name">{userDataHelper.capitalize(data.event.name)}</h2>
              <div className="premium-btns">
                {data.event.public ? <button className='public'>Public</button> : null }
                {data.event.premium ? <button className='premium'>Premium</button> : null }
              </div>
              <div className="left">
                <h4 className="title-text">📅 {userDataHelper.genFullDateFormat(data.event.date)} ⏰ {userDataHelper.genTimeFormat(data.event.date)}</h4>
                <h4 className="title-text">🧑‍💼 Organizator: </h4>
                <div className="organizator">
                  <UserAvatar userId={data.event.organizatorId} premium={data.event.organizator.premium} canChange={false} className="organizator-avatar"/>
                  <div className="data">
                    <p className="text">📛 {data.event.organizator.name}</p>
                    <p className="text">🧍 {data.event.organizator.sex} 🍼 {userDataHelper.countYears(data.event.organizator.age)} years</p>
                  </div>
                </div>
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
              <div className="right">
                <div className="place">
                  <h4 className='title-text'>🏠 Place:</h4>
                  {data.event.placeObj ? <>
                    <PlaceCard id={data.event.placeObj.id} className="place-card" placeName={data.event.placeObj.name} cityName={data.event.cityObj.name} opinionStars={data.event.placeObj.opinionStars}/>
                    <GoogleMaps localizationString={data.event.placeObj.localizationString}/>
                  </> : null}
                </div>
                <div className="restrictions">
                  <h4 className="title-text">❌ Restrictions</h4>
                  <ul>
                  {data.event.membersRestrictions ? data.event.membersRestrictions.map((restriction: string) => {
                    return <li key={restriction}>👉 {restriction}</li>
                  }) : null}
                  </ul>
                </div>
              </div>
              <h4 className="title-text">🗒️ Description:</h4>
              <div className="description" dangerouslySetInnerHTML={{ __html: data.event.description}}/>
              {user ? 
              <div className='buttons'>
                {user._id === data.event.organizatorId ? 
                <>
                  <button onClick={() => navigate("/myevents")}>Manage event</button>
                </> : 
                <>
                  <button onClick={() => setUserWantJoin(true)}>Join event</button>
                </>
                }
              </div> : null
              }
              </div>
              <ConfirmationModal visible={userWantJoin} setVisible={setUserWantJoin} confirmHandler={startJoiningEvent} text="Are you sure you want to join this event?" title="Joining event"/>
              <InformationModal visible={showConfirmationModal} setVisible={setShowConfirmationModal} errorText={errorText} successText={successText}/>
          </div>
      )
}

export default EventQuery