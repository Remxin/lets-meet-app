import React, { useState, useCallback, useContext } from 'react'
import { AddPlaceContext } from '../../../../contexts/AddPlaceContext'

//UI
import { Card, Grid } from "@nextui-org/react"
import { FaRegFileImage } from "react-icons/fa"

//animations
import { motion , useAnimation} from "framer-motion"
import { errorVariants } from '../variants/errorVariants'

const Phase4 = ({phaseIncrementer}: any) => {
    const errorVariant = useAnimation()
    //@ts-ignore
    const {files, setFiles} = useContext(AddPlaceContext)
    const [fileNames, setFileNames] = useState([])
    const [fakeUrls, setFakeUrls] = useState(["#"])     // fake url for displaying image inside the input
    const [err, setErr] = useState("")

    function displayError(error: string) {
        errorVariant.start("animate")
        setErr(error)
    }


    const addFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target?.files) {
          //@ts-ignore
          setFiles(e.target.files);
        //   setFakeUrl(URL.createObjectURL(e.target.files[0]))

          let filenames = []
          let fakeurls = []
          //@ts-ignore
          for (let filename of e.target.files) {
              //@ts-ignore
              console.log(filename)
              //@ts-ignore
              filenames.push(filename.name)
              fakeurls.push(URL.createObjectURL(filename))
          }
          //@ts-ignore
          setFileNames(filenames);
          setFakeUrls(fakeurls)
        }
    }, []);

    function nextHanlder() {
        if (!files || files.length < 1 ) return displayError("Please select at least 1 place image")
        phaseIncrementer((prev: number) => prev + 1)
    }

  return (
    <Grid.Container  className='add-place-phase-content'>
        <Grid.Container>
            <label htmlFor='place-file-input' className='place-image-label'><FaRegFileImage/><span>Select files</span></label>
            <input id="place-file-input" className="place-image-input" type="file" onChange={addFile} accept="image/png, image/jpg" multiple/>
        </Grid.Container>
        <fieldset className='images-names'>
            <legend>Images names</legend>
            <ul>
                {fileNames.map((filename: string) => {
                    return <li>{filename}</li>
                })}
            </ul>
        </fieldset>
        <div className="images">
            {/* @ts-ignore */}
            {fakeUrls.map((fakeUrl: string) => {
                return <img src={fakeUrl} alt="place image"/>
            })}
        </div>
        
        <motion.p variants={errorVariants} initial="initial" animate={errorVariant} className='err'>{err}</motion.p>
        <div className='phase-footer'>
            <button onClick={() => phaseIncrementer((prev:number) => prev - 1)} className="prev">Previous step</button>
            <button onClick={nextHanlder} className="finish">Add Place</button>
        </div>
    </Grid.Container>
  )
}

export default Phase4