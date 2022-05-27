import React from 'react'
import "../../../styles/scss/pagesComponents/eventCard/OrganizatorCard.scss"
import { Card, Col, Text, Grid, Row, Button } from "@nextui-org/react";

import userDataHelper from '../../../helpers/userData'

type organizatorProps = {
    name: String,
    sex: String,
    age: Number,
    premium: Boolean,
    id: String
}





const OrganizatorCard = ({id, name, sex, age, premium}: organizatorProps) => {
  return (
    <Grid xs={5} sm={3}>
      <Card cover css={{ bg: "$gold", w: "100%" }} clickable>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Text size={22} weight="bold" color="#ffffffff">
            {userDataHelper.capitalize(name)}
          </Text>
          <Text h4 color="#cccccc">
            {"Age: " + userDataHelper.countYears(age)}
          </Text>
        </Col>
      </Card.Header>
      <Card.Image
        src={`${process.env.REACT_APP_SERVER_IP}/get/user/avatar?userId=${id}`}
        height={340}
        width="100%"
        alt="Card image background"
      />
       <Card.Footer
      blur
      css={{
        position: "absolute",
        height: "80px",
        bgBlur: "#ffffff",
        borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Row>
        <Col>
          <Text color="#000" size={15} weight="bold">
            {userDataHelper.capitalize(sex)}
          </Text>
         
        </Col>
        {premium ? (
          <Col>
          <Row justify="flex-end">
            {/* <Button flat auto rounded color="secondary"> */}
            <Card css={{bg: "#aaaaaaa", linearGradient: "315deg, #fbb034 0%, #ffdd00 74%", br: "8px", border: "none", boxShadow: "1px 1px 5px .5px gold", height: "30px" }}>
              <Text
                css={{ color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                size={16}
                weight="bold"
                transform="uppercase"
              >
                premium
              </Text>
            </Card>
              
            {/* </Button> */}
          </Row>
        </Col>
        ) : null}
        
      </Row>
    </Card.Footer>
    </Card>
 
  </Grid>
  )
}

export default OrganizatorCard