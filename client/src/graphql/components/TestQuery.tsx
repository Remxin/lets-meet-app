import { useQuery } from "@apollo/client";
import { TESTQUERY } from "../queries/test";
import React from "react";

const TestQuery = () => {
  const { loading, error, data } = useQuery(TESTQUERY);
  if (loading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div>
        <p>Error: </p>
      </div>
    );
  return <div>TestQuery {data.test}</div>;
};

export default TestQuery;
