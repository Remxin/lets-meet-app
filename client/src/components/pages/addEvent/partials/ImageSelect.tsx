import React, { MutableRefObject, useRef, useState, useEffect, useMemo } from 'react'
import { FaRegFileImage } from 'react-icons/fa'
import "../../../../styles/scss/pagesComponents/addEvent/addEvent.scss"

import { getPlaceImagesLen } from "../../../../api/addEvent/getPlacesImg"

type moduleProp ={ 
    dataHolder: any,
    file: null | any,
    placeId: string,
    fileSrc: string
}

const ImageSelect = ({dataHolder, file, placeId, fileSrc}: moduleProp) => {
    const [selectValue, setSelectValue] = useState("")
    const [fileName, setFileName] = useState("Select image")
    const inputRef = useRef() as MutableRefObject<HTMLInputElement>
    const [partShown, setPartShown] = useState<null | number>(null)
    const [imagesSrc, setImagesSrc] = useState<string[]>([])
    const [resolvedImages, setResolvedImages] = useState(false)

    const [forceRefresh, setForceRefresh] = useState(false)

    console.log(fileSrc);
    
    const images = useMemo(() => {
        return imagesSrc.map((image: string) => {
            return <img src={image} alt="place image" key={image} className="select-image" onClick={(e) => {                
                //@ts-ignore
                dataHolder.fileSrc = e.target.src
                dataHolder.file = null
                setForceRefresh(prev => !prev)
            }}
            style={{
                border: image === dataHolder.fileSrc ? "3px solid orangered" : "none"
            }}
            />
        })
    }, [imagesSrc, forceRefresh])

    useEffect(() => {
        console.log(selectValue)
        if (selectValue === "") return
        if (selectValue === "own") setPartShown(1)
        if (selectValue === "place") setPartShown(2)
    }, [selectValue])

    useEffect(() => {
        if (partShown !== 2) return
        if (resolvedImages) return
        async function resolveImages() {
            const res = await getPlaceImagesLen(placeId)
            if (!res) return
            const arr = []
            console.log(res);
            
            //@ts-ignore
            for (let i = 0; i < res.len; i++) {
                arr.push(`${process.env.REACT_APP_SERVER_IP}/get/place/img?photoIndex=${i}&placeId=${placeId}`)
            }
            console.log(arr);
            
            setImagesSrc(arr)
            setResolvedImages(true)
        }

        resolveImages()
    }, [partShown])
    console.log(imagesSrc);


    
    function addFile(e: React.ChangeEvent) {
        if (partShown === 1) {
            // @ts-ignore
            setFileName(inputRef.current.files[0].name)
            dataHolder.fileSrc = ""
            //@ts-ignore
            dataHolder.file = inputRef.current.files[0]
        }
    }
  return (
    <div className="image-select">
        <select onChange={(e) => setSelectValue(e.target.value)}>
            <option value="" defaultChecked hidden>Select image</option>
            <option value="own">My own file</option>
            <option value="place" disabled={placeId.charAt(0) === "^"}>Place image</option>
        </select>
        {partShown !== null ?  <p className="image-text">{fileName}</p> : null }
        {partShown === 1 ?
        <>
        <label htmlFor="event-image-input" className="event-image-label">
        <FaRegFileImage/> <span>{fileName}</span>
        </label>
        <input type="file" ref={inputRef} onChange={addFile} accept="image/png, image/jpg" id="event-image-input" className="event-image-input"/>
        </> : null }
        {partShown === 2 ? 
        <div className='image-selector'>
            {images}
        </div> : null}
    </div>
  )
}

export default ImageSelect