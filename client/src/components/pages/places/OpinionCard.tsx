import React from 'react'

import { Card } from "@nextui-org/react"
import UserAvatar from '../../../modules/UserAvatar'

import { Rating } from 'react-simple-star-rating'
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa"

import { motion } from "framer-motion"

type componentType = {
    data: {
        stars: number,
        comment: string,
        user: {
            name: string,
            id: string
            premium: boolean
        }
    }
}

const OpinionCard = ({data}: componentType) => {
console.log(data.stars);

  return (
    <motion.div>
        <Card className="comment-card">
            <div className="user-info">
                <UserAvatar userId={data.user.id} premium={data.user.premium} canChange={false} className="user-avatar"/>
                <p>{data.user.name}</p>
            </div>
            <div className="rating">

                 <Rating
                    ratingValue={0}
                    transition
                    allowHalfIcon
                    readonly={true}
                    initialValue={data.stars}
                    emptyIcon={<FaRegStar/>}
                    fullIcon={<FaStar/>}
                    fullStyle={{ color: "#ffd100"}}
                  />
            </div>
            <div className="text">{data.comment}</div>
        </Card>
    </motion.div>
  )
}

export default OpinionCard