import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext';

import { useQuery } from '@apollo/client';
import { EVENTSQUERY } from '../queries/events';
import { Card, Loading } from '@nextui-org/react';
import EventCard from '../../components/pages/EventCard';

const JoinedEventsQuery = () => {
    //@ts-ignore
    const { user } = useContext(UserContext)
    const { loading: loadingJoin, error: errorJoin, data: dataJoin } = useQuery(EVENTSQUERY, {
        // @ts-ignore
        variables: { userId: user ? user._id : null, eventsType: "joinedevents"}
    });

    if (!user) {
        return <Loading>Loading user data...</Loading>
    }

    if (loadingJoin) return <Loading>Loading my events data...</Loading>

    if (errorJoin) return <p>Error in loading my events data</p>


  return (
    <Card className='events-container'>
        <h2 className="subclass-title">Joined Events</h2>
        {dataJoin.events.length === 0 ? "No events joined" : dataJoin.events.map((event: any) => {
            return <EventCard id={event.id} name={event.name} organizatorId={event.organizatorId} premium={event.premium} isPublic={event.public} place={event.placeObj.name} city={event.cityObj.name} members={event.members} organizator={event.organizatorId} restrictions={event.membersRestrictions} maxMembers={event.maxMembers} date={event.date} imageSrc={event.imageSrc}/>
        })}
        
    </Card>
  )
}

export default JoinedEventsQuery