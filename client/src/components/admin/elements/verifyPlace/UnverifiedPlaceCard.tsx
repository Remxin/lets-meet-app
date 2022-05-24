import React, {useEffect} from 'react'
import {Grid, Card, Row, Text, Divider, Button, Spacer} from '@nextui-org/react'
import GoogleMaps from "../../../../modules/GoogleMaps"
import {FaGlobeAmericas, FaMapMarkedAlt, FaIdCard} from "react-icons/fa"
import ALink from "../../../../modules/ALink"


type placeType = {
  id: String
  name: String
  city: {name: String, country: String, state: String}
  website: string
  description: String,
  localizationString: String
}



const UnverifiedPlaceCard = ({id ,name, city, website, description, localizationString}:placeType) => {
  console.log(localizationString)
    if (!city?.name || !city?.country || !city?.state) {
        return <p>Error</p>
    }
  return (
    <Grid.Container gap={2} justify="flex-start">
      <Grid sm={12} md={5}>
        <Card css={{ mw: "500px" }} clickable>
          <Card.Header>
          <FaIdCard size={30}/>
            <Spacer x={.5} />
            <Text b>{name}</Text>
            <Spacer x={2} />
            <FaGlobeAmericas size={30}/>
            <Spacer x={.5}/>
            <Text><ALink href={website} text={name}/></Text>
            <Spacer x={2} />
            <FaMapMarkedAlt size={30}/>
            <Spacer x={.5}/>
            <Text>{city.name + " " + city.country + " " + city.state}</Text>
          </Card.Header>
          <Divider />
          <Card.Body css={{ py: "$10" }}>
            <Text>
              {description}
            </Text>
            <img />
          <GoogleMaps localizationString={localizationString}/>
          </Card.Body>
          <Divider />
          <Card.Footer>
            <Row justify="flex-end">
              <Button size="sm" light color="error">
                Reject
              </Button>
              <Button size="sm" color="success">
                Accept
              </Button>
            </Row>
          </Card.Footer>
        </Card>
      </Grid>
    
    </Grid.Container>
  )
}

export default UnverifiedPlaceCard