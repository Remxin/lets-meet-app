import React from "react";
import { useNavigate } from "react-router-dom";

type eventProps = {
  id: String;
  name: String;
  organizatorId: String;
  premium: Boolean;
  isPublic: Boolean;
  place: String;
  city: String;
  members: String[];
  organizator: any;
  restrictions: String[];
};

function capitalize(string: String) {
  console.log(string);
  const stringArr = string.split("");
  let returnString = "";
  let first = true;
  //@ts-ignore
  stringArr.forEach((char: String) => {
    if (first) {
      first = false;
      returnString += char.toLocaleUpperCase();
    } else {
      returnString += char;
    }
  });
  return returnString;
}
const EventCard = ({
  id,
  name,
  organizatorId,
  premium,
  isPublic,
  place,
  city,
  members,
  organizator,
  restrictions,
}: eventProps) => {
  const navigate = useNavigate();
  return (
    <div
      key={id.toString()}
      style={{ backgroundColor: premium ? "gold" : "gray" }}
      onClick={() => navigate("/event/" + id)}
    >
      <h2>{capitalize(name)}</h2>
      <h4>{city}</h4>
      <p>Organizator: {capitalize(organizator.name)}</p>
      <p>Wymagania: </p>
      <ul>
        {restrictions.map((restriction) => (
          <li>{restriction}</li>
        ))}
      </ul>
      <img
        src={process.env.REACT_APP_SERVER_IP + "/get/event-image?eventId=" + id}
        alt="event image"
        style={{ width: 500 }}
      />
      <div className="labels">
        {premium ? <div>Premium</div> : null}
        {isPublic ? <div>Public</div> : null}
      </div>
    </div>
  );
};

export default EventCard;
