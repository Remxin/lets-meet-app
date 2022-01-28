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

  useEffect(() => {
    if (user) {
      setPromotionsLeft(user.promotionEvents);
    }
  }, [user]);

  const placeRef = useRef() as MutableRefObject<HTMLSelectElement>;
  const singleRestrictionRef = useRef() as MutableRefObject<HTMLInputElement>;
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
  // console.log(restrictions);

  // ------ render ------
  return (
    <form>
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
      <select>{citiesOpt}</select>
      <p>Localization (select 'my own place' to add your specific place)</p>
      <select ref={placeRef} onChange={specyfyPlace}>
        <option value="other">Tutaj wpisz miejsca z bazy danych</option>
        <option value="">My own place</option>
      </select>
      {uniquePlace ? (
        <div>
          <input
            type="text"
            placeholder="Name the place of event or select one: "
          />
          <p>
            Add this place to official places. Help us and get free premium
            event!{" "}
            <span>
              *after adding event you will be redirected to other subpage
            </span>
          </p>
          <input type="checkbox" />
        </div>
      ) : null}

      <p>Public? (everyone can join without request)</p>
      <input type="checkbox" />
      <p>Everyone can write on chat?</p>
      <input type="checkbox" />
      <p>
        Premium Event <span>*left: {promotionsLeft}</span>
      </p>
      <input type="checkbox" disabled={promotionsLeft === 0} />
      <br />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default AddEvent;
