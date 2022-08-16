import React, { useState, useRef, MutableRefObject } from 'react'
import { Modal, Input } from "@nextui-org/react"

import { FaUserAlt, FaMale, FaBaby } from "react-icons/fa"

import userDataHelper from '../../../helpers/userData'
import { updateInfo } from "../../../api/user/updateInfo"

type changeModalType = {
    isOpen: boolean,
    setOpen: Function
    profileData: profileDataType
}

type profileDataType = {
    name: string,
    gender: string,
    age: number
}

const ChangeInfoModal = ({isOpen, setOpen, profileData}: changeModalType) => {
    const [err, setErr] = useState("")
    const nameRef = useRef() as MutableRefObject<HTMLInputElement>
    const genderRef = useRef() as MutableRefObject<HTMLInputElement>
    const ageRef = useRef() as MutableRefObject<HTMLInputElement>
    
    async function submitHandler() {
        if (!nameRef.current?.value) return setErr("Please enter new name")
        if (!genderRef.current?.value) return setErr("Please enter new gender")
        if (!ageRef.current?.value) return setErr("Please enter new age")
        const date = new Date(ageRef.current.value).getTime()
        const res = await updateInfo(nameRef.current.value, genderRef.current.value, date)
        //@ts-ignore
        if (res.err) return setErr(res.err)

        window.location.reload()
    }

  return (
    <Modal
    open={isOpen}
    onClose={() => setOpen(false)}
    aria-labelledby="modal-title"
    >
        <Modal.Header>
            <p style={{ fontWeight: "bold", fontSize: "24px"}}>Edit your profile data</p>
        </Modal.Header>
        <Modal.Body>
            <Input initialValue={profileData.name} placeholder="Enter your name" contentLeft={<FaUserAlt/>} ref={nameRef}/>
            <Input initialValue={profileData.gender} placeholder="Enter your gender" contentLeft={<FaMale/>} ref={genderRef}/>
            <Input type="date" contentLeft={<FaBaby/>} initialValue={userDataHelper.genBirthdateString(profileData.age)} ref={ageRef}/>
            <p>{err}</p>
        </Modal.Body>
        <Modal.Footer>
        {/* @ts-ignore */}
        <button onClick={submitHandler} className="modal-button">
            Update
        </button>
        </Modal.Footer>

    </Modal>
  )
}

export default ChangeInfoModal