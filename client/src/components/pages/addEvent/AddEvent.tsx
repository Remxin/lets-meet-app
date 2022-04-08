import React, {
  useState,
  useMemo,
  useRef,
  MutableRefObject,
  useContext,
  useEffect,
} from "react";
import { UserContext } from "../../../contexts/UserContext";

import cities from "./cities.json";

const AddEvent = () => {
  //@ts-ignore
  const { user, setUser } = useContext(UserContext);

  const [uniquePlace, setUniquePlace] = useState(false);
  const [restrictions, setRestrictions] = useState([]);
  const [restrictionsHelper, setRestrictionsHelper] = useState(false); // used for execute useMemo after deleting item from restricton array
  const [promotionsLeft, setPromotionsLeft] = useState(0);

  const [fileName, setFileName] = useState(
    "Choose event image (or leave blank, to choose default image): "
  );
  const [file, setFile] = useState("");
  const [addUniquePlace, setAddUniquePlace] = useState(false); // if user wants to add his place to official
  const [operChat, setOpenChat] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [isPremiumEvent, setIsPremiumEvent] = useState(false);

  const placeRef = useRef() as MutableRefObject<HTMLSelectElement>;
  const singleRestrictionRef = useRef() as MutableRefObject<HTMLInputElement>;
  const uniquePlaceRef = useRef() as MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (user) {
      setPromotionsLeft(user.promotionEvents);
    }
  }, [user]);

  // sortuje nazwy miast alfabetycznie i zapamiętuje napisany w ten sposób stan raz - tworzy na ich podstawie opcjie do selecta
  const citiesOpt = useMemo(() => {
    let citiesSort = cities.sort();
    return citiesSort.map((city) => {
      return (
        <option value={city} key={city}>
          {city}
        </option>
      );
    });
  }, []);
  // -- rendering restrictions --
  const restrictionsList = useMemo(() => {
    return restrictions.map((restriction) => {
      return (
        <li value={restriction} key={restriction}>
          {restriction}{" "}
          <button type="button" onClick={() => deleteRestriction(restriction)}>
            X
          </button>
        </li>
      );
    });
  }, [restrictions, restrictionsHelper]);
  // --- set additional fields to specify user own localization ---
  const specyfyPlace = () => {
    if (placeRef.current?.value === "") {
      return setUniquePlace(true);
    }
    return setUniquePlace(false);
  };

  // --- adding new restricion ---
  const addRestriction = () => {
    if (singleRestrictionRef.current?.value) {
      //@ts-ignore
      setRestrictions([...restrictions, singleRestrictionRef.current.value]);
      singleRestrictionRef.current.value = "";
      singleRestrictionRef.current.focus();
    }
  };
  // --- deleting restriction ---
  const deleteRestriction = (restriction: string) => {
    //@ts-ignore
    const deleteIndex = restrictions.findIndex(
      (element) => element === restriction
    );
    console.log(deleteIndex);
    if (deleteIndex !== -1) {
      restrictions.splice(deleteIndex, 1);
      setRestrictions(restrictions);
      console.log(restrictions);
      setRestrictionsHelper(!restrictionsHelper);
    }
  };
  // --- choosing image file ---
  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      //@ts-ignore
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };
  // --- submit handler ---
  const submitHandler = (e: React.ChangeEvent<HTMLFormElement>) => {};
  // ------ render ------
  return (
    <form onSubmit={submitHandler}>
      <input type="text" placeholder="Event name: " />
      <br />
      <textarea
        cols={30}
        rows={10}
        placeholder="event description: "
      ></textarea>
      <p>Members restriction</p>
      <input
        type="text"
        placeholder="new restriction: "
        ref={singleRestrictionRef}
      />
      <button type="button" onClick={addRestriction}>
        Add restriction
      </button>
      <ul>{restrictionsList}</ul>
      <p>City</p>
      <select>
        <option value="!none" selected hidden>
          Select city
        </option>
        <option value="">other</option>
        {citiesOpt}
      </select>
      <p>Localization (select 'my own place' to add your specific place)</p>
      <select ref={placeRef} onChange={specyfyPlace}>
        <option value="!none" selected hidden>
          Choose place
        </option>
        <option value="other">Tutaj wpisz miejsca z bazy danych</option>
        <option value="">My own place</option>
      </select>
      {uniquePlace ? (
        <div>
          <input
            type="text"
            placeholder="Name the place of event or select one: "
            ref={uniquePlaceRef}
          />
          <p>
            Add this place to official places. Help us and get free premium
            event!{" "}
            <span>
              *after adding event you will be redirected to other subpage
            </span>
          </p>
          <input
            type="checkbox"
            onChange={() => setAddUniquePlace(!addUniquePlace)}
          />
        </div>
      ) : null}
      <p>{fileName}</p>
      <input type="file" onChange={addFile} />
      <p>Public? (everyone can join without request)</p>
      <input type="checkbox" onChange={() => setOpenEvent(!openEvent)} />
      <p>Everyone can write on chat?</p>
      <input type="checkbox" onChange={() => setOpenChat(!operChat)} />
      <p>
        Premium Event <span>*left: {promotionsLeft}</span>
      </p>
      <input
        type="checkbox"
        disabled={promotionsLeft === 0}
        onChange={() => setIsPremiumEvent(!isPremiumEvent)}
      />
      <br />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default AddEvent;