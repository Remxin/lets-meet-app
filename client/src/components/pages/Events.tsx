import React, { useEffect } from "react";
import EventsQuery from "../../graphql/components/EventsQuery";
import EventCard from "./EventCard";
import "../../styles/scss/pagesComponents/events/events.scss"
import "../../styles/scss/pagesComponents/events/576.scss"
import "../../styles/scss/pagesComponents/events/769.scss"

const Events = () => {
  return (
    <div className="events-container">
      <EventsQuery />
    </div>
  );
};

export default Events;
