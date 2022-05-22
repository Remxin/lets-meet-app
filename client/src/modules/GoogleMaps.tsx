import React from "react";
//@ts-ignore
// import GoogleMapReact from "google-map-react";
// import { Map, GoogleApiWrapper } from "google-map-react";
// import { Wrapper } from "@googlemaps/react-wrapper";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

interface MapsProps {
  localizationString: String;
}

const GoogleMaps = ({ localizationString }: MapsProps) => {
  console.log();
  const { isLoaded } = useLoadScript({
    //@ts-ignore
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <iframe
      src={`https://www.google.com/maps/embed?pb=${localizationString}`}
      width="600"
      height="450"
      // style="border:0;"
      // allowfullscreen=""
      loading="lazy"
      // referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default GoogleMaps;
