import React, { useEffect } from "react";
import EventsQuery from "../../graphql/components/EventsQuery";
import EventCard from "./EventCard";

const Events = () => {
  return (
    <div>
      <EventsQuery />
    </div>
  );
};

export default Events;
