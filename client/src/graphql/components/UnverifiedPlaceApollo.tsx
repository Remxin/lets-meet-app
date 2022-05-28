import React, {useState, useRef, MutableRefObject, useEffect, useMemo} from 'react'
import { useQuery } from '@apollo/client';
import {PLACEQUERY} from '../queries/placeQuery'
import {useNavigate} from "react-router-dom"
import "../../styles/scss/apolloComponents/UnverifiedPlace.scss"

import {Grid, Card, Text, Switch, Input, Button} from "@nextui-org/react"
import ALink from '../../modules/ALink'
import GoogleMaps from '../../modules/GoogleMaps';

import { getPlaceImgLen } from '../../api/place/getPlaceLen';
import { placeLink } from '../../api/place/placeImageLink';
import { verifyPlace } from '../../api/place/verifyPlace';
import { rejectPlace } from '../../api/place/rejectPlace';

import {FaStar} from 'react-icons/fa'


type unverifiedPlaceType = {
  verified: Boolean,
  placeId: String
}

const UnverifiedPlaceApollo = ({verified, placeId}: unverifiedPlaceType) => {
  const { loading, error, data } = useQuery(PLACEQUERY, {
    variables: {verified, placeId}
  });



  const [editable, setEditable] = useState(false)
  const [localizationString, setLocalizationString] = useState("")
  const websiteRef = useRef() as MutableRefObject<HTMLInputElement>
  const [imagesCount, setImagesCount] = useState([])
  const [err, setErr] = useState("")

  const navigate = useNavigate()

  // ------ Ładowanie zdjęć ------
  useEffect(() => {
    async function getImages() {
      setErr("")
      let imgLen = await getPlaceImgLen(placeId)
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
    getImages()
  }, [])

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


    //  _______________ QUERY IS SUCCESSFULL ________________

    async function verPlace() {
      const resData = await verifyPlace(data.place.id)
      if (resData.err) {
        return setErr(resData.err)
      }
      console.log(resData.msg)
      navigate("/admin")
    }

    async function rejPlace() {
      const resData = await rejectPlace(data.place.id)
      console.log(resData)
      if (resData.err) {
        return setErr(resData.err)
      }

      console.log(resData.msg)
      navigate("/admin")
    }
  const place = data.place

  return (
    <div>
      <Grid.Container gap={2} className="unverified-place-page">
        <Grid className="grid">
          <Card className="card">
            <div className='left-side'>
            <Text h4 className='title'>{place.name}</Text>
            <Text className='question'>Edit data?</Text>
            <Grid>
              <Switch shadow color="warning" checked={false} icon={<FaStar/>} onChange={() => setEditable((prev) => !prev)}/>
            </Grid>
            <Grid>
              <Input
                rounded
                bordered
                label="Name"
                placeholder="Name"
                color="warning"
                initialValue={place.name}
                disabled={!editable}
              />
            </Grid>
            <Grid>
              <Input
                rounded
                bordered
                label="Localization String"
                placeholder="Localization String"
                color="warning"
                initialValue={place.localizationString}
                disabled={!editable}
                onChange={(e) => setLocalizationString(e.target.value)}
              />
            </Grid>
            <Grid>
              <Input
                rounded
                bordered
                label="Website"
                placeholder="Website"
                color="warning"
                initialValue={place.website}
                disabled={!editable}
                ref={websiteRef}
              />
             
            </Grid>
            <Grid>
              <ALink text="Place website" href={websiteRef.current?.value ? websiteRef.current?.value : ""}/>
            </Grid>
            <Grid>
              <p className="premium-label">Premium</p>
              <select disabled={!editable} className="premium-select">
                <option value="false">false</option>
                <option value="true" selected={place.premium}>true</option>
              </select>
            </Grid>
           <div className='description'>
             <h6>Unformated description</h6>
             <p>{place.description}</p>
           </div>
            </div>
            <div className='right-side'>
               <GoogleMaps localizationString={localizationString ? localizationString : place.localizationString}/>
            <div className="place-gallery">
              <h5 className='gallery-title'>Place Gallery</h5>
              <div className='gallery-content'>
                {placeImages}
              </div>
            </div>
            </div>
            
            <Card.Footer className='card-footer'>
                <Button shadow color="error" auto className='reject-button' onClick={() => rejPlace()}>
              Reject place
              </Button>
              <Button shadow color="success" auto className='accept-button' onClick={() => verPlace()}>
                Accept Place
              </Button>
            </Card.Footer>
          </Card>
        </Grid>
        </Grid.Container>
    </div>
 
  )
}

export default UnverifiedPlaceApollo