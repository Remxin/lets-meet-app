import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { useQuery } from '@apollo/client';
import { EVENTSQUERY } from '../queries/events'

import { Loading, Card } from '@nextui-org/react';

import MyEventCard from '../../components/pages/MyEventCard';

import '../../styles/scss/pagesComponents/events/events.scss'

const MyEventsQuery = () => {
    //@ts-ignore
    const { user } = useContext(UserContext)

    
    const { loading: loadingMy, error: errorMy, data: dataMy } = useQuery(EVENTSQUERY, {
        // @ts-ignore
        variables: { userId: user ? user._id : null, eventsType: "myevents"}
    });
   
    
    if (!user) {
        return <Loading>Loading user data...</Loading>
    }

    if (loadingMy) return <Loading>Loading my events data...</Loading>

    if (errorMy) return <p>Error in loading my events data</p>


    
  return (
    <Card className="events-container">
        <h2 className="subclass-title">My Events</h2>
        {dataMy.events.length === 0 ? "No events created" : null}
        {dataMy.events.map((event: any) => {
            return <MyEventCard id={event.id} name={event.name} organizatorId={event.organizatorId} premium={event.premium} isPublic={event.public} place={event.placeObj.name} city={event.cityObj.name} members={event.members} organizator={event.organizatorId} restrictions={event.membersRestrictions} maxMembers={event.maxMembers} date={event.date} imageSrc={event.imageSrc}/>
        })}
    </Card>
  )
}

export default MyEventsQuery