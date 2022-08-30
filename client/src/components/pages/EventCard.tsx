import React from "react";
import { useNavigate } from "react-router-dom";
import userDataHelper from '../../helpers/userData'
import { Card, Col, Row, Button, Text} from '@nextui-org/react'

type eventProps = {
  id: String;
  name: String;
  organizatorId: String;
  premium: Boolean;
  isPublic: Boolean;
  place: String;
  city: String;
  members: any[];
  organizator: any;
  restrictions: String[];
  maxMembers: Number
  date: number
  imageSrc: string
};

const EventCard = ({ id, name, organizatorId, premium, isPublic, place, city, members, organizator, restrictions, maxMembers, date, imageSrc }: eventProps) => {
  const navigate = useNavigate();
  return (
    <Card cover className="event-card" clickable hoverable onClick={() => navigate("/event/" + id)}>
    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }} className="card-header">
      <Col>
        <Text className="title">
          {name}
        </Text>
        <Text className="city">
          {userDataHelper.capitalize(place)}
        </Text>
      </Col>
    </Card.Header>
    <Card.Body>
      <Card.Image
        // src={`${process.env.REACT_APP_SERVER_IP}/get/event-image?eventId=${id}`}
        src={imageSrc}
        height={400}
        width="100%"
        alt="Relaxing app background"
      />
    </Card.Body>
    <Card.Footer
      blur
      className="card-footer"
      css={{
        position: "absolute",
        bgBlur: "#0f1114",
        borderTop: "$borderWeights$light solid $gray700",
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Row>
        <Col>
          <Row>
            <Col>
              <p className="city">
                {userDataHelper.capitalize(city)}
              </p>
            </Col>
          </Row>
          
        
        </Col>
        <Col>
        </Col>
      </Row>
      <Row>
        <Col>
        <Col>
          <p className="date">
            📅  {userDataHelper.genFullDateFormat(date)}
          </p>
        </Col>
        <Col>
          <p className="time">
            ⏰ {userDataHelper.genTimeFormat(date)}
          </p>
        </Col>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="members">
            🧍 Members: {maxMembers === -1 ? members.length : `${members.length}/${maxMembers}`}
          </p>
        </Col>
      </Row>
      <Row>
          {isPublic ? (
            <Row justify="flex-end">
            <button className="public"
            >
              <p className="text">
                Public
              </p>
            </button>
          </Row>
          ) : null}
          {premium ? (
            <Row justify="flex-end" >
            <button className="premium"
            >
              <p className="text">
                Premium
              </p>
            </button>
          </Row>
          ) : null}
          </Row>
    </Card.Footer>
  </Card>
  );
};

export default EventCard;
