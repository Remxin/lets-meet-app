import React from 'react'
import MyEventsQuery from '../../graphql/components/MyEventsQuery'
import JoinedEventsQuery from '../../graphql/components/JoinedEventsQuery'

const MyEvents = () => {
  return (
    <>
    <MyEventsQuery/>
    <JoinedEventsQuery/>
    </>
  )
}

export default MyEvents