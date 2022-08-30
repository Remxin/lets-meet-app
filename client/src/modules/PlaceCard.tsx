import React from 'react'
import { Card } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"


type moduleType = {
    className: string
    placeName: string
    cityName: string
    id: string
    opinionStars: number
}


const PlaceCard = ({className, placeName, cityName, id, opinionStars}: moduleType) => {
    const navitate = useNavigate()
  return (
    <Card className={className} key={id} clickable hoverable onClick={() => navitate("/places/" + id)}>
        <img src={`${process.env.REACT_APP_SERVER_IP}/get/place/img?photoIndex=0&placeId=${id}`} alt="place image" />
        <p style={{
            position: "absolute",
            bottom: 0,
            backdropFilter: `blur(4px)`,
            width: `100%`,
            height: "42%"
        }}> <span className='placeName'>{placeName}</span><br/><span className="cityName">{cityName}</span> <br/> ⭐ {opinionStars !== -1 ? opinionStars + "" : "no opinions"}</p>
    </Card>
  )
}

export default PlaceCard