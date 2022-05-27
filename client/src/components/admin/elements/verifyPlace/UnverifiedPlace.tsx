import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import UnverifiedPlaceApollo from '../../../../graphql/components/UnverifiedPlaceApollo'

const UnverifiedPlace = () => {
    const params = useParams()
    if (!params.placeId) {
        return <Navigate to="/" />
    }
    return (
        <UnverifiedPlaceApollo placeId={params.placeId} verified={false}/>
    )
}

export default UnverifiedPlace