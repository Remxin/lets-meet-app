import { Divider } from "@nextui-org/react";
import React, { MutableRefObject, useState } from "react";
//TODO: przy kazdym przeładowaniu strony musi być autoryzacja admina

import ErrorsTable from "./elements/ErrorsTable";
import Radios from "./elements/Radios";

import VerifyPlace from "./elements/VerifyPlace";
import AddCity from "./elements/AddCity";
import AddPlace from "./elements/AddPlace";

const AdminPanel = () => {
  const [page, setPage] = useState("errors");

  return (
    <div>
      <Radios setPage={setPage} />
      {/* <h2>Admin Table</h2> */}
      {page === "errors" ? <ErrorsTable /> : null}
      {page === "verifyPlaces" ? <VerifyPlace /> : null}
      {page === "addCity" ? <AddCity /> : null}
      {page === "addPlace" ? <AddPlace /> : null}
    </div>
  );
};

export default AdminPanel;
