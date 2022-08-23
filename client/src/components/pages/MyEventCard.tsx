import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import userDataHelper from '../../helpers/userData'
import { Card, Col, Row, Button, Text, Loading} from '@nextui-org/react'
import UserAvatar from "../../modules/UserAvatar";


import "../../styles/scss/pagesComponents/events/events.scss"
import useFetch from "../../hooks/useFetch";

import { getJoinRequests } from '../../api/event/getJoinRequests'
import { rejectUser } from "../../api/event/rejectUser";
import { acceptUser } from "../../api/event/acceptUser"

import { motion, AnimatePresence } from "framer-motion" 

type eventProps = {
  id: string;
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

const requestMenuBgcVariants = {
  initial: {
    opacity: 0
  },

  animate: {
    opacity: 1
  }
}
const requestMenuVariants = {
  initial: {
    bottom: "-100px"
  },

  animate: {
    height: "40vh",
    bottom: 0
  },

  exit: {
    bottom: "-100px",
    height: 0
  }
}

const MyEventCard = ({ id, name, organizatorId, premium, isPublic, place, city, members, organizator, restrictions, maxMembers, date, imageSrc }: eventProps) => {
  const navigate = useNavigate();

  const [showRequestMenu, setShowRequestMenu] = useState(false)
  const [hoveredCardId, setHoveredCardId] = useState(null)

  const getRequestsCount = () => {
    return getJoinRequests(id)
  }

  const rejectUserFromEvent = useCallback(async (requestId: string) => {
    const res = await rejectUser(requestId)
    console.log(res);
    

  }, [hoveredCardId])

  // async function acceptUser(requestId: string) {

  // }
  
  const acceptUserFromEvent = useCallback(async (requestId: string) => {
    console.log(hoveredCardId);
    console.log('accept');
    
    const res = await acceptUser(requestId)
    console.log(res);
      
  }, [hoveredCardId])
  //@ts-ignore
  const {loading, error, data: requests, startFetching  } = useFetch(getRequestsCount, true)  
  
  return (
    <>
    <Card cover className="event-card" clickable hoverable onClick={() => setShowRequestMenu(true)}>
    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }} className="card-header">
      <div className="request-counts">
        {error ? "❌" : null}
        {loading ? <Loading/> : requests?.length}
      </div>
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
  <AnimatePresence>
    {showRequestMenu ? 
    <motion.div className="bottom-request-background" onClick={(e) => {
      e.stopPropagation()
      setShowRequestMenu(false)
      }} variants={requestMenuBgcVariants} initial="initial" animate="animate" exit="initial">
      <motion.div className="bottom-request-menu" variants={requestMenuVariants} initial="initial" animate="animate" exit="exit">
              <h2 className="menu-title">Event Requests</h2>
              {/* @ts-ignore */}
              {requests?.map((request) => {
                console.log(request);
                
                return <motion.div className="user-info" onHoverStart={() => setHoveredCardId(request._id)} onHoverEnd={() => setHoveredCardId(null)}>
                  <UserAvatar userId={request.userId} premium={request.userData.premium} className="user-avatar" />
                  <p className="data">📛 {request.userData.name} <br/> 🧍 {request.userData.sex} 🍼 {userDataHelper.countYears(request.userData.age)}</p>
                  <AnimatePresence>
                    {!!hoveredCardId ? <motion.div className="accept-menu" variants={requestMenuBgcVariants} initial="initial" animate="animate" exit="initial">Accept?
                      <div className="buttons">
                        <button onClick={() => rejectUserFromEvent(request._id)}>❌</button>
                        <button onClick={() => acceptUserFromEvent(request._id)}>✅</button>
                      </div>
                    </motion.div> : null }
                  </AnimatePresence>
                </motion.div>
              })
              }
      </motion.div>
    </motion.div> : null}
  </AnimatePresence>
  </>
  );
};

export default MyEventCard;
