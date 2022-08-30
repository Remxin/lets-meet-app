//@ts-nocheck
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


const pageTransitionVariants = {
  initial: {
    left: "-100%"
  },

  animate: {
    left: 0
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
    fileSrc: "",
    maxMembers: -1

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

  const [canAdd, setCanAdd] = useState(false)

  const [showSummary, setShowSummary] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [error, setError] = useState("aaa")

  const eventNameRef = useRef() as MutableRefObject<HTMLInputElement>; // name of event
  const dateRef = useRef() as MutableRefObject<HTMLInputElement>; // name of event
  const eventDescriptionRef = useRef() as React.LegacyRef<JoditEditor>
  const cityRef = useRef() as MutableRefObject<HTMLSelectElement>;

  const placeRef = useRef() as MutableRefObject<HTMLSelectElement>;

const canSetPremium:boolean = promotionsLeft === 0 && !user.premium // set the opposite

  useEffect(() => {
    if (user) {
      //@ts-ignore
      if (user.premium) return setPromotionsLeft("premium")
      setPromotionsLeft(Math.floor(user.promotionEvents));
    }
  }, [user]);

  const handlerFunction = useCallback(() => {
    //@ts-ignore
    return addEvent(dataHolder.name, dataHolder.openEvent, dataHolder.premium, dataHolder.restrictions, dataHolder.place, dataHolder.city.id, dataHolder.description, dataHolder.openChat, dataHolder.file, dataHolder.fileSrc, dataHolder.maxMembers, dataHolder.time)
    //@ts-ignore
  }, [eventNameRef.current?.value, isPremiumEvent, restrictions, placeRef.current?.getValue(), cityRef.current?.id(), eventDescriptionRef.current?.value, openChat, file])



  // --- submit handler ---
  const submitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    //@ts-ignore
    if(e.keyCode == 13) {
      return false;
    }

    if (!canAdd) return false
    
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
        <AnimatePresence>
        {phaseCounter === 0 ? 
          <motion.div className="section" style={{ display: "flex", flexDirection: "column"}} variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit">
            <h3>Basic informations</h3>
            <Input bordered placeholder="Event name" ref={eventNameRef} initialValue={dataHolder.name}/>
            <Input type="datetime-local" ref={dateRef} min={new Date().toISOString().slice(0, 16)} max={new Date(Date.now() + (1000* 60 * 60 * 24 * 365)).toISOString().slice(0, 16)} initialValue={dataHolder.time.toLocaleString()}/>
            <JoditEditor
                    ref={eventDescriptionRef}
                    value={dataHolder.description}
                    config={{placeholder: "Event description: ", maxLenght: 200, textAlign: "left"}}
                      //@ts-ignore
                    tabIndex={1} // tabIndex of textarea
                  className="jodit"
                    
            />
            <button type="button" onClick={enter1phase} className="next-btn">Next</button>
          </motion.div>
          : null}
        </AnimatePresence>

        <AnimatePresence>
        {phaseCounter === 1 ? <motion.div className="section" variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit">
          <h3>Restricions</h3>
            <Restrictions setRestrictions={setRestrictions} defaultRestrictions={dataHolder.restrictions}/>
          <button onClick={enter2phase} className="next-btn">Next</button>
        </motion.div> : null}
       </AnimatePresence>
      
        <AnimatePresence>
       {phaseCounter === 2 ? <motion.div className="section" variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit">
        <h3>Localization</h3>
        <CitySelect ref={cityRef} setId={setCityId}/>
        {/* @ts-ignore */}
          <PlaceSelect ref={placeRef} cityId={cityId}/>
         <button onClick={enter3phase} className="next-btn">Next</button>
       </motion.div> : null }
       </AnimatePresence>

          <AnimatePresence>
       {phaseCounter === 3 ? <motion.div className="section" variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit">
          <h3>Image</h3>  
         <ImageSelect dataHolder={dataHolder} file={dataHolder.file} placeId={dataHolder.place} fileSrc={dataHolder.fileSrc}/>
        <button onClick={enter4phase} className="next-btn">Next</button>
       </motion.div> : null }
       </AnimatePresence>

       <AnimatePresence>
       {phaseCounter === 4 ? 
       <>
       <motion.div className="section" variants={pageTransitionVariants} initial="initial" animate="animate" exit="exit">
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
          >Premium event <span className="promotions-left"> *left: {promotionsLeft}</span></Checkbox>
          <Input type="number" placeholder="Maximum members count" onChange={(e) => dataHolder.maxMembers = +e.target.value}/>
       </motion.div>
        <Grid className="add-event-button-grid">
          <Button flat color="warning" auto type="submit" className="add-event-button" onClick={() => setCanAdd(true)}>
            Add Event
          </Button>
        </Grid>
        </> : null }
        </AnimatePresence>

      
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
