import React from "react";
import PanelElement from "./PanelElement";

const UserPanel = () => {
  return (
    <div>
      <h2>User Panel</h2>
      <div>
        <PanelElement name="Change password" link="/user/change-password" text="" />
        <PanelElement name="Add avatar" link="/user/add-avatar" text="" />
      </div>
    </div>
  );
};

export default UserPanel;
