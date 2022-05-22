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
    if (!localizationString || !cityNameRef.current?.value || !countryRef.current?.value || !stateRef.current?.value) return setErr("Complete all the fields")
    const res = await addCity(cityNameRef.current.value, countryRef.current.value, localizationString, stateRef.current.value);
    //@ts-ignore
    console.log(res)
    //@ts-ignore
    if (res.err) return setErr(res.err)
    //@ts-ignore
    setMsg(res.msg)
  }
  
  const krakow =
    "!1m18!1m12!1m3!1d327952.4182831036!2d19.724694226515123!3d50.0464284278981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471644c0354e18d1%3A0xb46bb6b576478abf!2zS3Jha8Ozdw!5e0!3m2!1spl!2spl!4v1653168271697!5m2!1spl!2spl";
  const warszawa =
    "!1m18!1m12!1m3!1d312779.9431310756!2d20.781016711291045!3d52.232606289062204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc669a869f01%3A0x72f0be2a88ead3fc!2sWarszawa!5e0!3m2!1spl!2spl!4v1653168438438!5m2!1spl!2spl";
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
        <GoogleMaps localizationString={localizationString}></GoogleMaps>
      ) : null}
    </form>
  );
};

export default AddCity;
