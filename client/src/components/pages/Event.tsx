import React from "react";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import EventQuery from '../../graphql/components/EventQuery'

const Event = () => {
  const params = useParams();
  if (!params.eventId) {
    return <Navigate replace to="/" />
  }
  return (
    <div>
      {/* @ts-ignore */}
      <EventQuery eventId={params.eventId}/>
      
      
    </div>
  );
};

export default Event;
