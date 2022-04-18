import React from "react";
import { useParams } from "react-router-dom";

const Event = () => {
  const params = useParams();
  console.log(params);
  return (
    <div>
      {/* <img
        src={
          (process.env.REACT_APP_SERVER_IP =
            "/get/event-image/" + params.eventId)
        }
        alt="event image"
      /> */}
    </div>
  );
};

export default Event;
