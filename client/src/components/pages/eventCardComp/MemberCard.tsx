import React from 'react'
import { Avatar, Card, Text, Grid, Row} from '@nextui-org/react'
import userDataHelper from '../../../helpers/userData'

type memberProps = {
    id: String,
    name: String,
    age: Number,
    sex: String,
    premium: Boolean
}

const MemberCard = ({id, name, age, sex, premium}: memberProps) => {
  return (
    <Grid.Container gap={2} justify="flex-start" css={{w: "180px", marginRight: "-20px", height: "80px"}}>
        <Grid xs={14} sm={14} key={id + ""} css={{height: "120px"}}>
          <Card clickable>
            <Card.Body css={{ p: 0, height: "80px" }}>
              <Card.Image
                objectFit="cover"
                src={`${process.env.REACT_APP_SERVER_IP}/get/user/avatar?userId=${id}`}
                width="50%"
                height={60}
                alt={name + ""}
              />
            </Card.Body>
            {/* @ts-ignore */}
            <Card.Footer justify="flex-start" >
              <Row wrap="wrap" justify="space-between" css={{display: "flex", flexDirection: "column", marginTop: "-6px"}}>
                <Text b>{userDataHelper.capitalize(name)}</Text>
                <Text css={{ color: "$accents4", fontWeight: "$semibold", fontSize: "12px" }}>
                  {"Age: " + userDataHelper.countYears(age)}
                </Text>
                <Text css={{fontSize: "10px"}}>{userDataHelper.capitalize(sex)}</Text>
              </Row>
              {premium ? (
                  <Row wrap='wrap' justify='space-between'>
                  <Text b>PREMIUM</Text>
                </Row>
              ) : null}
              
            </Card.Footer>
          </Card>
        </Grid>
    </Grid.Container>
  
  )
}

export default MemberCard