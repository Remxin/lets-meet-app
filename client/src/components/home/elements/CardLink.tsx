import React from 'react'
import { Card, Col, Text, Row, Button } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"

type CardLinkType = {
    href: string,
    title: string,
    text: string,
    imgLink: string
}

const CardLink  = ({href, title, text, imgLink}:CardLinkType) => {
    const navigate = useNavigate()

  return (
    <Card clickable hoverable onClick={() => navigate(href)} className="link-card">
        <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
            <Text h3 weight="bold" transform="uppercase" className='card-title'>
            {title}
            </Text>
        </Col>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
        <Card.Image
            src={imgLink}
            width="100%"
            height="100%"
            objectFit="cover"
            alt="Card example background"
        />
        </Card.Body>
        <Card.Footer
        //@ts-ignore
        isBlurred
        css={{
            position: "absolute",
            bgBlur: "#ffffff66",
            borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
            bottom: 0,
            zIndex: 1,
        }}
        className="card-footer"
        >
        <Col>
            <Col>
            <Text color="#ffffffee" className="card-text">
                {text}
            </Text>
            </Col>
            <Col>
            <Row justify="center">
                <Button flat auto rounded color="secondary" size="xs">
                <Text
                    css={{ color: "inherit" }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                >
                    Go to page
                </Text>
                </Button>
            </Row>
            </Col>
        </Col>
        </Card.Footer>
  </Card>
  )
}

export default CardLink