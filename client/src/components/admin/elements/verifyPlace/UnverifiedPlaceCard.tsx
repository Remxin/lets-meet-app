import React, {useEffect} from 'react'
import {Grid, Card, Row, Text, Divider, Button, Spacer} from '@nextui-org/react'
import GoogleMaps from "../../../../modules/GoogleMaps"
import {FaGlobeAmericas, FaMapMarkedAlt, FaIdCard} from "react-icons/fa"
import ALink from "../../../../modules/ALink"
import {useNavigate} from 'react-router-dom'


type placeType = {
  id: String
  name: String
  city: {name: String, country: String, state: String}
  website: string
  description: String,
  localizationString: String
}



const UnverifiedPlaceCard = ({id ,name, city, website, description, localizationString}:placeType) => {
  const navigate = useNavigate()
  console.log(localizationString)
    if (!city?.name || !city?.country || !city?.state) {
        return <p>Error</p>
    }
  return (
    //@ts-ignore
    <Grid.Container gap={2} justify="flex-start" onClick={() => navigate("/admin/unverifiedPlace/" + id)} key={id}>
      <Grid sm={8} md={4}>
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
          {/* <GoogleMaps localizationString={localizationString}/> */}
          </Card.Body>
          <Divider />
          <Card.Footer>
            <Row justify="flex-end">
              
            </Row>
          </Card.Footer>
        </Card>
      </Grid>
    
    </Grid.Container>
  )
}

export default UnverifiedPlaceCard