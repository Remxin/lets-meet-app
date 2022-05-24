import React from 'react'
import { useQuery } from "@apollo/client";
import {UNVERIFIEDPLACESQUERY } from '../queries/unverifiedPlaces'
import UnverifiedPlaceCard from "../../components/admin/elements/verifyPlace/UnverifiedPlaceCard"
import { placeType } from '../../types/modelTypes';

type queryVars = {
    verified: Boolean
}
const UnverifiedPlaces = ({verified}:queryVars) => {
    const { loading, error, data } = useQuery(UNVERIFIEDPLACESQUERY, {
        variables: {verified}
    });
    if (loading)
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    if (error)
      return (
        <div>
          <p>Error: </p>
        </div>
      );
      
    console.log(data.places)
      return (
          <div>
              {data.places.map((place: placeType) => {
                //@ts-ignore
                  return <UnverifiedPlaceCard id={place.id} name={place.name} website={place.website} city={place.city} description={place.description} localizationString={place.localizationString}/>
              })}
          </div>
      )
  
}

export default UnverifiedPlaces