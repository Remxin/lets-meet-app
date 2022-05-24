import React from 'react'

type linkProps = {
  href: string
  text: String
}
const ALink = ({href, text}: linkProps) => {
  if (href.charAt(5) !== ":" || href.charAt(7) !== "/") {
    href = "https://" + href
  }
  return (
      <a href={href} target="_blank">{text}</a>
  )
}

export default ALink