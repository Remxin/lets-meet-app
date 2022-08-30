import { useQuery } from '@apollo/client'
import React from 'react'
import { UNVERIFIEDPLACESQUERY } from "../queries/unverifiedPlaces"

import { Loading } from '@nextui-org/react'
import PlaceCard from '../../modules/PlaceCard'

import "../../styles/scss/apolloComponents/VerifiedPlaces/VerifiedPlaces.scss"
import "../../styles/scss/apolloComponents/VerifiedPlaces/576.scss"
import "../../styles/scss/apolloComponents/VerifiedPlaces/769.scss"

const VerifiedPlaces = () => {
    const { error, loading, data} = useQuery(UNVERIFIEDPLACESQUERY, { variables: {
        verified: true
    }})

    if (loading) return <Loading>Loading places...</Loading>
    if (error) return <p>Error</p>
    console.log(data);
    
  return (
    <div className='verified-places-container'>
        {data.places.map((place: any) => {
            return <PlaceCard key={place.id} className="place-card" placeName={place.name} cityName={place.city.name} id={place.id} opinionStars={place.opinionStars}/>
        })}
    </div>
  )
}

export default VerifiedPlaces