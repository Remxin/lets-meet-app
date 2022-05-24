import React from "react";

export const addCity = (
  cityName: String,
  country: String,
  localizationString: String,
  state: String
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!cityName || !country || !localizationString || !state) return resolve({err: "Complete all the fields"})
      const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/add/city`, {
        method: "POST",
        body: JSON.stringify({
          cityName,
          country,
          localizationString,
          state,
        }),
        credentials: "include"
      });
      const resData = await res.json();
      if (resData.err) resolve(resData.err)
      resolve({ msg: resData.msg });
    } catch (err) {
      reject(err);
    }
  });
};
