import React from 'react'
import { Loading } from "@nextui-org/react"

type loadingType = {
    size: "sm" | "lg" | "xs" | "md" | "xl"
    text: string
}

export const WholePageLoading = ({size, text}: loadingType) => {
  return (
    <div style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }}><Loading>{text}</Loading></div>
  )
}
