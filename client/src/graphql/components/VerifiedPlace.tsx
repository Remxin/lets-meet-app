import React, { useState, useEffect, useMemo, useCallback, MutableRefObject, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { PLACEQUERY } from "../queries/placeQuery"
import { OPINIONSQUERY } from '../queries/opinionsQuery'
import { getPlaceImgLen } from "../../api/place/getPlaceLen"
import { placeLink } from '../../api/place/placeImageLink'
import { sendOpinion } from '../../api/place/sendOpinion'

import { Card, Checkbox, Input, Loading } from "@nextui-org/react"
import GoogleMaps from '../../modules/GoogleMaps'
import MessageInput from '../../modules/MessageInput'
import OpinionCard from '../../components/pages/places/OpinionCard'
import { Rating } from 'react-simple-star-rating'
import InformationModal from '../../modules/InformationModal'

import { FaRegStar, FaStar} from "react-icons/fa"

import "../../styles/scss/apolloComponents/VerifiedPlace/VerifiedPlace.scss"
import "../../styles/scss/apolloComponents/VerifiedPlace/576.scss"
import "../../styles/scss/apolloComponents/VerifiedPlace/769.scss"
import { Navigate } from 'react-router-dom'

const VerifiedPlace = () => {
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [imagesCount, setImagesCount] = useState([])
    const [ratingVal, setRatingVal] = useState(0)

    const [err, setErr] = useState("")
    const [msg, setMsg] = useState("")
    const [showInfoModal, setShowInfoModal] = useState(false)

    const opinionsDivRef = useRef() as MutableRefObject<HTMLDivElement>
    const params = useParams()

    const { loading, error, data } = useQuery(PLACEQUERY, { variables: {
      verified: true,
      placeId: params.placeId
    }})
    
    const { loading: opinionsLoading, error: opinionsError, data: opinionsData, refetch: opinionsRefetch } = useQuery(OPINIONSQUERY, { variables: {
      placeId: params.placeId
    }})

    useEffect(() => {
      if (imagesLoaded) return
      if (!data) return 
      async function getImages() {
        // setErr("")
        let imgLen = await getPlaceImgLen(data.place.id)
        //@ts-ignore
        if (imgLen.err) setErr(imgLen.err)
        //@ts-ignore
        imgLen = imgLen.len
        //@ts-ignore
        for (let i = 0; i < imgLen; i++) {
          // @ts-ignore
          setImagesCount((elements) => [...elements, i])
        }
      }
      setImagesLoaded(true)
      getImages()
    }, [data])

   
    
    // ----- komponent ze zdjęciami -----
 const placeImages = useMemo(() => {
   console.log(data)
   if (!!data?.place) {
     console.log(imagesCount)
     return imagesCount.map((number) => {
       return (
         <img src={placeLink(data.place.id, number)} alt="event image" className='event-image'/>
       );
     });
   } 
   return <div></div>
 }, [imagesCount, data]);

console.log(ratingVal);

const deliverOpinion = useCallback(async (comment: string) => {
  if (!params.placeId) return
  setErr("")
  setMsg("")

  if (ratingVal === 0) {
    setErr("Please rate place using stars ")
    setShowInfoModal(true)
    return
  }
  const res = await sendOpinion(params.placeId?.toString(), ratingVal, comment)
  //@ts-ignore
  if (res.err) {
    //@ts-ignore
    setErr(res.err)
    setShowInfoModal(true)
  }
  //@ts-ignore
  if (res.msg) {
    opinionsRefetch()
    //@ts-ignore
    setMsg(res.msg)
    setShowInfoModal(true)
  }
}, [ratingVal])

    if (!params.placeId) return <Navigate to="/"/>
    if (loading) return <Loading>Loading place data...</Loading>
    if (error) return <p>Error</p>
    
console.log(opinionsData);

    
  return (
    <Card className='verified-place-container'>
          <img className="bgc-image" src={`${process.env.REACT_APP_SERVER_IP}/get/place/img?photoIndex=0&placeId=${data.place.id}`} alt="main place image" />

          <div className="data">
            {data.place.premium ? <div className="premium-label">PREMIUM</div> : null}
            <p className='name'>{data.place.name}</p>
            <p className="city">🏠 {data.place.city.name}</p>
            <p className='website'><a href={data.place.website}>🌐 website</a></p>
            <p className="rating">⭐ {data.place.opinionStars === -1 ? "none" : data.place.opinionStars + "/5"}</p>
            <GoogleMaps localizationString={data.place.localizationString}/>
              <h3>🖼️ Images</h3>
            <div className="place-images">
              {placeImages}
            </div>
            <div className="description" dangerouslySetInnerHTML={{ __html: `<h3 style="text-align: center">🗒️ Description</h3>` + data.place.description }}/>
            <div className="opinions-container">
              {/* <Checkbox onChange={() => {
                setShowComments(prev => !prev)
                setTimeout(() => {
                  opinionsDivRef.current.scrollIntoView({ behavior: "smooth", block: "start"})
                }, 200)
              }}>Show opinions</Checkbox> */}
               
                {/* <div className="opinions" ref={opinionsDivRef} style={{ display: showComments ? "flex" : "none"}}> */}
                  <h3>⭐ Opinions</h3>
                <div className="opinions" ref={opinionsDivRef}>
                  {opinionsLoading ? <Loading>Loading opinions...</Loading> : null}
                  {opinionsError ? <p>Error in loading opinions</p> : null}
                  {opinionsData ? opinionsData.placeOpinions.map((opinion: any) => {
                    return <OpinionCard data={opinion}/>
                  }) : null}
                  </div>
                  {/* <div className="do-rating" style={{ display: showComments ? "block" : "none"}}> */}
                  <div className="do-rating">
                    <div className="rating">
                      <Rating ratingValue={ratingVal} readonly={false} emptyIcon={<FaRegStar/>} fullIcon={<FaStar/>} allowHalfIcon={true} onClick={(val) => setRatingVal(val / 20)}/>
                    </div>
                    <MessageInput sendMessageFun={deliverOpinion} placeHolder="Write an opinion..." showSendButton={true} showEmojis={false}/>
                  </div>
               
             
            </div> 
          </div>
          <InformationModal visible={showInfoModal} setVisible={setShowInfoModal} errorText={err} successText={msg} />
    </Card>
  )
}

export default VerifiedPlace