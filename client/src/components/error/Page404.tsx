import React from "react";
import "../../styles/scss/err/page404.scss"

const Page404 = () => {
  return <div style={{
    width: "100%",
    height: "90vh",
    background: `url("/wet-sad-dog.png")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    paddingTop: "30px"
  }} className="page-404">

    <div className="text">
      <h2>Oh no!</h2>
      <p>This page does not longer exist!</p>
    </div>
    
    </div>;
};

export default Page404;
