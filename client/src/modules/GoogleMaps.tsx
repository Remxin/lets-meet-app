import React from "react";

interface MapsProps {
  localizationString: String;
  changeFun?: Function
}

function cutLocalizationString(locStr: String) {
  let arr = locStr.split("pb=")
    arr = arr[1].split("\"")
    locStr = arr[0]
    // console.log(locStr)
    return locStr
}

const GoogleMaps = ({ localizationString, changeFun }: MapsProps) => {
  console.log(localizationString)
  if (localizationString.charAt(0) === "<") {
    localizationString = cutLocalizationString(localizationString)

    if (changeFun) {
      changeFun(localizationString)
    }
  }

  return (
    <iframe
      src={`https://www.google.com/maps/embed?pb=${localizationString}`}
      width="600"
      height="450"
      className="google-maps"
      loading="lazy"
      // referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default GoogleMaps;
