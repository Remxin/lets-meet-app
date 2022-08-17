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
};

const EventCard = ({ id, name, organizatorId, premium, isPublic, place, city, members, organizator, restrictions, maxMembers }: eventProps) => {
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
        src={`${process.env.REACT_APP_SERVER_IP}/get/event-image?eventId=${id}`}
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
              <Text color="#dcdcdc" size={18}>
                {userDataHelper.capitalize(city)}
              </Text>
              <Text color="#d1d1d1" size={12}>
                Members: {maxMembers === -1 ? members.length : `${members.length}/${maxMembers}`}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col>
            
          
        </Col>
      </Row>
      <Row>
          {isPublic ? (
            <Row justify="flex-end">
            <Button
              flat
              auto
              rounded
              css={{ color: "#ffffff", linearGradient: "326deg, #a4508b 0%, #5f0a87 74%" }}
              // #ffffcc #ffff00
            >
              <Text
                css={{ color: "inherit" }}
                size={12}
                weight="bold"
                transform="uppercase"
              >
                Public
              </Text>
            </Button>
          </Row>
          ) : null}
          {premium ? (
            <Row justify="flex-end" >
            <Button
              flat
              auto
              rounded
              css={{ color: "#ffffff", linearGradient: "315deg, #fbb034 0%, #ffdd00 74%" }}
              // #ffffcc #ffff00
            >
              <Text
                css={{ color: "inherit" }}
                size={12}
                weight="bold"
                transform="uppercase"
              >
                Premium
              </Text>
            </Button>
          </Row>
          ) : null}
          </Row>
    </Card.Footer>
  </Card>
  );
};

export default EventCard;
