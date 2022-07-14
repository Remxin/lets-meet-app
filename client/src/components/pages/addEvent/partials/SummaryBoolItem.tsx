import React from 'react'
import { Text } from "@chakra-ui/react"

type SummaryBoolItemType = {
    isTrue: Boolean,
    text: String
}

const SummaryBoolItem = ({isTrue, text}: SummaryBoolItemType) => {
  return <Text fontSize='xs' textColor={isTrue ? "#00cd00" : "#cd0000"}>{text}: {isTrue ? "YES" : "NO"}</Text>
}

export default SummaryBoolItem