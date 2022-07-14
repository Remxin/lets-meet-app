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
import { Input, Checkbox, Spacer, Grid, Button } from "@nextui-org/react";

// partials
import PlaceSelect from "./partials/PlaceSelect";
import CitySelect from "./partials/CitySelect";
import Restrictions from "./partials/Restrictions";
import Summary from "./partials/Summary";
import Confirmation from "./partials/Confirmation";

import { AnimatePresence } from "framer-motion"
 


const AddEvent = () => {
  //@ts-ignore
  const { user } = useContext(UserContext);

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

  const eventNameRef = useRef() as MutableRefObject<HTMLInputElement>; // name of event
  const eventDescriptionRef = useRef() as React.LegacyRef<JoditEditor>
  const cityRef = useRef() as MutableRefObject<HTMLSelectElement>;

  const placeRef = useRef() as MutableRefObject<HTMLSelectElement>;
  const uniquePlaceRef = useRef() as MutableRefObject<HTMLInputElement>;

const canSetPremium:boolean = promotionsLeft === 0

  useEffect(() => {
    if (user) {
      setPromotionsLeft(user.promotionEvents);
    }
  }, [user]);

  const handlerFunction = useCallback(() => {
    //@ts-ignore
    return addEvent(eventNameRef.current?.value, openEvent, isPremiumEvent, restrictions, placeRef.current?.getValue(), cityRef.current?.id(), eventDescriptionRef.current?.value, openChat, file)
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
    //@ts-ignore
    // console.log(eventDescriptionRef.current?.value)
    let place = null;
    // console.log(placeRef.current?.value);
    // TODO: add error handling
    if (!eventNameRef.current?.value) {
      // error nazwy
      return;
    }
    //@ts-ignore
    if (!eventDescriptionRef.current?.value) {
      return;
    }
    //@ts-ignore
    if (!cityRef.current?.name() || cityRef.current.name() === "!none") {
      console.log("nie ma city");
      return;
    }
    //@ts-ignore
    console.log(placeRef?.current.getValue())
    if (placeRef.current.value === "!none") {
      // zapomniano wybrać miejsca
      console.log("nie wybrano miejsca");
      return;
    } 
    return setShowSummary(true)

  };
  
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
      <input type="file" onChange={addFile} />
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
      {/* @ts-ignore */}
      <button onClick={() => setAddResponse({err: "User not verified"})}>change res</button>
      <AnimatePresence>
      {/* @ts-ignore */}
      {showSummary ? (<Summary name={eventNameRef.current?.value} description={eventDescriptionRef.current?.value} restrictions={restrictions} city={cityRef.current.name()} place={placeRef.current.getValue()} premium={isPremiumEvent} openChat={openChat} openEvent={openEvent} setShowThisMenu={setShowSummary} setShowConfirmation={setShowConfirmation}/>) : null}
      {showConfirmation ? <Confirmation submitHandler={
        //@ts-ignore
       handlerFunction
        
       //@ts-ignore
      } wantToAddUniquePlace={placeRef.current.wantToAddUniquePlace}/> : null}
      </AnimatePresence>
    </form>
  );
};

export default AddEvent;
