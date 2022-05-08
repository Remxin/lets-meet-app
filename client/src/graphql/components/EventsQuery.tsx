import React, { useEffect } from "react";
import { EVENTSQUERY } from "../queries/events";
import { useQuery } from "@apollo/client";
import EventCard from "../../components/pages/EventCard";

type eventProps = {
  id: String;
  name: String;
  organizatorId: String;
  premium: Boolean;
  public: Boolean;
  place: String;
  city: String;
  members: any[];
  organizator: any;
  membersRestrictions: String[];
  maxMembers: Number,
};
//@ts-ignore
const EventsQuery = () => {
  const { loading, error, data } = useQuery(EVENTSQUERY);

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
  console.log(data);
  return (
    <div>
      {data.events.map((event: eventProps) => (
        <EventCard
          id={event.id}
          name={event.name}
          organizatorId={event.organizatorId}
          premium={event.premium}
          isPublic={event.public}
          place={event.place}
          city={event.city}
          members={event.members}
          organizator={event.organizator}
          restrictions={event.membersRestrictions}
          maxMembers={event.maxMembers}
        />
      ))}
    </div>
  );
};

export default EventsQuery;
