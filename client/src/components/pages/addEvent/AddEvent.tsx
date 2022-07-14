import axios from "axios";
import React, {
  useState,
  useCallback,
  useRef,
  MutableRefObject,
  useContext,
  useEffect,
} from "react";
import { UserContext } from "../../../contexts/UserContext";
// importing adding promise
import { addEvent } from "../../../api/addEvent/addEvent";

import JoditEditor from 'jodit-react'
// graphical components 
import { Input, Checkbox, Spacer, Grid, Button, Text } from "@nextui-org/react";

// partials
import PlaceSelect from "./partials/PlaceSelect";
import CitySelect from "./partials/CitySelect";
import Restrictions from "./partials/Restrictions";
import Summary from "./partials/Summary";
import Confirmation from "./partials/Confirmation";

import { AnimatePresence, motion, useAnimation } from "framer-motion"
import "../../../styles/scss/pagesComponents/addEvent/addEvent.scss"


const paragraphVariants = {
  hidden: {
    opaciy: 0,
    scale: 0.2
  },

  visible: {
    opacity: 1,
    scale: 1
  }
}
 


const AddEvent = () => {
  //@ts-ignore
  const { user } = useContext(UserContext);
  const errorAnimationControll = useAnimation()

  const [restrictions, setRestrictions] = useState([]);
  const [promotionsLeft, setPromotionsLeft] = useState(0);
  const [cityId, setCityId] = useState("") // use to force rerendering this component

  const [fileName, setFileName] = useState(
    "Choose event image (or leave blank, to choose default image): "
  );
  const [file, setFile] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [isPremiumEvent, setIsPremiumEvent] = useState(false);

  const [showSummary, setShowSummary] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [error, setError] = useState("aaa")

  const eventNameRef = useRef() as MutableRefObject<HTMLInputElement>; // name of event
  const eventDescriptionRef = useRef() as React.LegacyRef<JoditEditor>
  const cityRef = useRef() as MutableRefObject<HTMLSelectElement>;

  const placeRef = useRef() as MutableRefObject<HTMLSelectElement>;

const canSetPremium:boolean = promotionsLeft === 0

  useEffect(() => {
    if (user) {
      setPromotionsLeft(Math.floor(user.promotionEvents));
    }
  }, [user]);

  const handlerFunction = useCallback(() => {
    //@ts-ignore
    return addEvent(eventNameRef.current?.value, openEvent, isPremiumEvent, restrictions, placeRef.current?.getValue(), cityRef.current?.id(), eventDescriptionRef.current?.value, openChat, file)
    //@ts-ignore
  }, [eventNameRef.current?.value, isPremiumEvent, restrictions, placeRef.current?.getValue(), cityRef.current?.id(), eventDescriptionRef.current?.value, openChat, file])


console.log(cityId)
 
  // --- choosing image file ---
  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      //@ts-ignore
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };
  // --- submit handler ---
  const submitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    let place = null;

    // TODO: add error handling
    if (!eventNameRef.current?.value) {
      showError("Please enter event name")
      return;
    }
    //@ts-ignore
    if (!eventDescriptionRef.current?.value) {
      showError("Please enter event description")
      return;
    }
    //@ts-ignore
    if (!cityRef.current?.name() || cityRef.current.name() === "!none") {
      showError("Please enter city")
      return;
    }
    //@ts-ignore
    console.log(placeRef?.current.getValue())
    //@ts-ignore
    if (placeRef.current?.getValue() === "!") {
      // zapomniano wybrać miejsca
      showError("Please choose your event's place")
      return;
    } 
    return setShowSummary(true)

  };


  function showError(errorText: string) {
    setError(errorText)
    errorAnimationControll.start({
      opacity: [0.7, 1],
      scale: [0.5, 1.2, 1],
      transition: {duration: 0.5, type: "ease-in-out"}
    })
  }
  
  // ------ render ------
  return (
    <form onSubmit={submitHandler}>
      <Input clearable bordered labelPlaceholder="Event name" initialValue="" ref={eventNameRef}/>
      <JoditEditor
            	ref={eventDescriptionRef}
              value={""}
              config={{placeholder: "Place description: ", maxLenght: 200}}
                //@ts-ignore
		          tabIndex={1} // tabIndex of textarea
      />
      <p></p>
    <Restrictions setRestrictions={setRestrictions}/>
    <CitySelect ref={cityRef} setId={setCityId}/>
    {/* @ts-ignore */}
      <PlaceSelect ref={placeRef} cityId={cityId}/>
      <p>{fileName}</p>
      <input type="file" onChange={addFile} accept="image/png, image/jpg"/>
      <Spacer y={.5}/>
      <Checkbox color="warning" onChange={() => setOpenEvent(prev => !prev)} >Everyone can join without request</Checkbox>
      <Spacer y={.5}/>
      {/* <p>Everyone can write on chat?</p> */}
      <Checkbox color="warning" onChange={() => setOpenChat(prev => !prev)} >Everyone can write on chat</Checkbox>
      {/* <p>
        Premium Event <span>*left: {promotionsLeft}</span>
      </p> */}
      <Spacer y={.5}/>
      <Checkbox
        // defaultChecked={true}
        color="warning"
        
        disabled={canSetPremium}
        onChange={() => setIsPremiumEvent(prev => !prev)}
      >Premium event <span> *left: {promotionsLeft}</span></Checkbox>
      <Grid>
        <Button flat color="warning" auto type="submit">
          Add Event
        </Button>
      </Grid>
    
      <AnimatePresence>
      {/* @ts-ignore */}
      {showSummary ? (<Summary name={eventNameRef.current?.value} description={eventDescriptionRef.current?.value} restrictions={restrictions} city={cityRef.current.name()} place={placeRef.current.getValue()} premium={isPremiumEvent} openChat={openChat} openEvent={openEvent} setShowThisMenu={setShowSummary} setShowConfirmation={setShowConfirmation}/>) : null}
      {showConfirmation ? <Confirmation submitHandler={
        //@ts-ignore
       handlerFunction
        
       //@ts-ignore
      } wantToAddUniquePlace={placeRef.current.wantToAddUniquePlace}/> : null}
      </AnimatePresence>
      <motion.p className="error-paragraph" animate={errorAnimationControll} initial={{opacity: 0, scale: 0.2}}>{error}</motion.p>
    </form>
  );
};

export default AddEvent;
