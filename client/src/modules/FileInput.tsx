import React, { useState } from 'react'
import "../styles/scss/modules/FileInput.scss"

import { FaRegFileImage } from "react-icons/fa"

type fileInputType = {
    setFile: () => any
}

const FileInput = ({ setFile }: fileInputType) => {
    const [fileName, setFileName] = useState("Choose file")

    function onChangeHandler (e: React.ChangeEvent) {
        //@ts-ignore
        setFileName(e.target.files[0].name)
        //@ts-ignore
        setFile(e.target.files[0])
    }
  return (
    <div>
        <label htmlFor='place-file-input' className='place-image-label'><FaRegFileImage/><span>{fileName}</span></label>
        <input id="place-file-input" className="place-image-input" type="file" onChange={onChangeHandler} accept="image/png, image/jpg"/>
    </div>
  )
}

export default FileInput