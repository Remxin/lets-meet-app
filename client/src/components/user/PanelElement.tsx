import React from "react";
import { NavLink } from "react-router-dom";

type elementProps = {
  name: String;
  link: String;
  text: String | null;
};

const PanelElement = ({ name, link, text }: elementProps) => {
  return (
    <div>
      {/* @ts-ignore */}
      <NavLink to={link}>{name}</NavLink>
      <p>{text}</p>
    </div>
  );
};

export default PanelElement;
