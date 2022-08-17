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
import { Input, Checkbox, Spacer, Grid, Button, Card } from "@nextui-org/react";

// partials
import PlaceSelect from "./partials/PlaceSelect";
import CitySelect from "./partials/CitySelect";
import Restrictions from "./partials/Restrictions";
import Summary from "./partials/Summary";
import Confirmation from "./partials/Confirmation";
import ImageSelect from "./partials/ImageSelect";

import { AnimatePresence, motion, useAnimation } from "framer-motion"
import "../../../styles/scss/pagesComponents/addEvent/addEvent.scss"
import { FaRegFileImage } from 'react-icons/fa'


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
  const [dataHolder, setDataHolder] = useState({
    name: "",
    time: Date.now(),
    openEvent: false,
    premium: false,
    restrictions: [],
    place: "",
    wantToAddUniquePlace: false,
    city: { name: "", id: "" },
    description: "",
    openChat: false,
    file: null,
    fileSrc: ""

  })
  const [phaseCounter, setPhaseConter] = useState(0)
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
  const dateRef = useRef() as MutableRefObject<HTMLInputElement>; // name of event
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
    return addEvent(dataHolder.name, dataHolder.openEvent, dataHolder.premium, dataHolder.restrictions, dataHolder.place, dataHolder.city.id, dataHolder.description, dataHolder.openChat, dataHolder.file, dataHolder.fileSrc)
    //@ts-ignore
  }, [eventNameRef.current?.value, isPremiumEvent, restrictions, placeRef.current?.getValue(), cityRef.current?.id(), eventDescriptionRef.current?.value, openChat, file])


 
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
    console.log(dataHolder);
    
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
  function enter1phase() {
    if (!eventNameRef.current?.value) return  showError("Please enter event's name")
    if (!dateRef.current?.value) return showError("Please enter event's date")
    const dateDiff = new Date().getTime() - new Date(dateRef.current.value).getTime()
    if (Math.abs(dateDiff / (1000 * 60)) < 30) return showError("Event must be announced at least 30 minutes in advance")
    //@ts-ignore
    if (!eventDescriptionRef.current?.value) return showError("Please enter event's description")

    setDataHolder(prev => {
      //@ts-ignore
      return {...prev, name: eventNameRef.current.value, time: new Date(dateRef.current.value).getTime(), description: eventDescriptionRef.current.value}
    })
    setError("")
    setPhaseConter(prev => prev + 1)
  }
  
  function enter2phase() {
    setDataHolder(prev => {
      //@ts-ignore
      return {...prev, restrictions}
    })
    setPhaseConter(prev => prev + 1)
  }

  function enter3phase() {
    //@ts-ignore
    if (!cityRef.current?.name() || cityRef.current.name() === "!none") return showError("Please enter city")
    //@ts-ignore
    if (placeRef.current.getValue() === "!") return showError("Please enter place")
    setDataHolder(prev => {
      //@ts-ignore
      return {...prev, city: {name: cityRef.current.name(), id: cityRef.current.id()}, place: placeRef.current.getValue(), wantToAddUniquePlace: placeRef.current.wantToAddUniquePlace}
    })
    setPhaseConter(prev => prev +1)
  }

  function enter4phase() {
    if (!dataHolder.file && !dataHolder.fileSrc) return showError("Please select file")
    setPhaseConter(prev => prev +1)
  }
  
  

  
  // ------ render ------
  return (
    <Card className="add-event-card">
      <form onSubmit={submitHandler}>
        {phaseCounter === 0 ? 
        <div className="section" style={{ display: "flex", flexDirection: "column"}}>
          <h3>Basic informations</h3>
          <Input bordered placeholder="Event name" ref={eventNameRef} initialValue={dataHolder.name}/>
          <Input type="datetime-local" ref={dateRef} min={new Date().toISOString().slice(0, 16)} max={new Date(Date.now() + (1000* 60 * 60 * 24 * 365)).toISOString().slice(0, 16)} initialValue={dataHolder.time.toLocaleString()}/>
          <JoditEditor
                  ref={eventDescriptionRef}
                  value={dataHolder.description}
                  config={{placeholder: "Event description: ", maxLenght: 200}}
                    //@ts-ignore
                  tabIndex={1} // tabIndex of textarea
                  
          />
          <button type="button" onClick={enter1phase}>Next</button>
        </div>
         : null}
        
       {phaseCounter === 1 ? <div className="section">
         <h3>Restricions</h3>
          <Restrictions setRestrictions={setRestrictions} defaultRestrictions={dataHolder.restrictions}/>
         <button onClick={enter2phase}>Next</button>
       </div> : null}
      
       {phaseCounter === 2 ? <div className="section">
        <h3>Localization</h3>
        <CitySelect ref={cityRef} setId={setCityId}/>
        {/* @ts-ignore */}
          <PlaceSelect ref={placeRef} cityId={cityId}/>
         <button onClick={enter3phase}>Next</button>
       </div> : null }

       {phaseCounter === 3 ? <div className="section">
          <h3>Image</h3>  
         <ImageSelect dataHolder={dataHolder} file={dataHolder.file} placeId={dataHolder.place} fileSrc={dataHolder.fileSrc}/>
        <button onClick={enter4phase}>Next</button>
       </div> : null }
       {phaseCounter === 4 ? 
       <>
       <div className="section">
          <h3>Additional informations</h3> 
          <Spacer y={.5}/>
          <Checkbox size="md" className="checkbox-with-label" color="warning" onChange={() => {
            setOpenEvent(prev => !prev)
            dataHolder.openEvent = !dataHolder.openEvent
            }} >Everyone can join without request</Checkbox>
          <Spacer y={.5}/>
          {/* <p>Everyone can write on chat?</p> */}
          <Checkbox size="md" className="checkbox-with-label" color="warning" onChange={() => {
            setOpenChat(prev => !prev)
            dataHolder.openChat = !dataHolder.openChat
            }} >Everyone can write on chat</Checkbox>
          {/* <p>
            Premium Event <span>*left: {promotionsLeft}</span>
          </p> */}
          <Spacer y={.5}/>
          <Checkbox
            size="md"
            className="checkbox-with-label"
            color="warning"
            
            disabled={canSetPremium}
            onChange={() => {
              setIsPremiumEvent(prev => !prev)
              dataHolder.premium = !dataHolder.premium
            }}
          >Premium event <span> *left: {promotionsLeft}</span></Checkbox>
       </div>
        <Grid className="add-event-button-grid">
          <Button flat color="warning" auto type="submit" className="add-event-button">
            Add Event
          </Button>
        </Grid>
        </> : null }

      
        <AnimatePresence>
        {/* @ts-ignore */}
        {showSummary ? (<Summary name={dataHolder.name} description={dataHolder.description} restrictions={dataHolder.restrictions} city={dataHolder.city.name} place={dataHolder.place} premium={dataHolder.premium} openChat={dataHolder.openChat} openEvent={dataHolder.openEvent} setShowThisMenu={setShowSummary} setShowConfirmation={setShowConfirmation}/>) : null}
        {showConfirmation ? <Confirmation submitHandler={
          //@ts-ignore
        handlerFunction
          
        //@ts-ignore
        } wantToAddUniquePlace={dataHolder.wantToAddUniquePlace}/> : null}
        </AnimatePresence>
        <motion.p className="error-paragraph" animate={errorAnimationControll} initial={{opacity: 0, scale: 0.2}}>{error}</motion.p>
      </form>
    </Card>
  );
};

export default AddEvent;
