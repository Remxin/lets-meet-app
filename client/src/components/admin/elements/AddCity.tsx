import React, { useState, useRef, MutableRefObject } from "react";
import { Grid, Input, Button } from "@nextui-org/react";

import GoogleMaps from "../../../modules/GoogleMaps";
// @ts-ignore
import { addCity } from "../../../api/city/addCity";


const AddCity = () => {
  const [err, setErr] = useState("")
  const [msg, setMsg] = useState("If you set proper localization string, the city should be displayed below")
  const [localizationString, setLocalizationString] = useState("");
  const cityNameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const countryRef = useRef() as MutableRefObject<HTMLInputElement>;
  const stateRef = useRef() as MutableRefObject<HTMLInputElement>;

  async function submitHandler(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("")
    setErr("")
    const res = await addCity(cityNameRef.current.value, countryRef.current.value, localizationString, stateRef.current.value);
    //@ts-ignore
    if (res.err) return setErr(res.err)
    //@ts-ignore
    setMsg(res.msg)
  }

  
  return (
    <form onSubmit={(e:React.ChangeEvent<HTMLFormElement>) => submitHandler(e)}>
      <Grid.Container gap={4}>
        <Grid>
          <Input underlined labelPlaceholder="City name" color="warning" ref={cityNameRef}/>
          <Input underlined labelPlaceholder="Country" color="warning" ref={countryRef}/>
          <Input
            underlined
            labelPlaceholder="Localization string"
            color="warning"
            onChange={(e) => setLocalizationString(e.currentTarget.value)}
          />
          <Input underlined labelPlaceholder="State" color="warning" ref={stateRef}/>
        </Grid>
        <Grid>
          <Button flat color="warning" auto type="submit">
            Add this city
          </Button>
        </Grid>
      </Grid.Container>
      <p>{err}</p>
      <p>{msg}</p>
      {localizationString !== "" ? (
        <GoogleMaps localizationString={localizationString} changeFun={setLocalizationString}></GoogleMaps>
      ) : null}
    </form>
  );
};

export default AddCity;
