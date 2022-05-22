import React from "react";
import { Radio, Spacer } from "@nextui-org/react";

const Radios = ({ setPage }: any) => {
  return (
    <Radio.Group
      row
      value="primary"
      onChange={(value) => {
        setPage(value);
      }}
    >
      <Radio value="errors" color="warning" textColor="warning" checked={true}>
        Errors
      </Radio>
      {/* <Spacer /> */}
      <Radio value="verifyPlaces" color="warning" textColor="warning">
        Verify places
      </Radio>
      {/* <Spacer /> */}
      <Radio value="addPlace" color="warning" textColor="warning">
        Add place
      </Radio>
      {/* <Spacer /> */}
      <Radio value="addCity" color="warning" textColor="warning">
        Add city
      </Radio>
      {/* <Spacer /> */}
    </Radio.Group>
  );
};

export default Radios;
