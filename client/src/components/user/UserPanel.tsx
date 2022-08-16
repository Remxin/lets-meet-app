import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Card, Loading } from "@nextui-org/react";
import { WholePageLoading } from "../../modules/WholePageLoading";
import UserAvatar from "../../modules/UserAvatar";
import ChangeInfoModal from "./changePassword/ChangeInfoModal";
import ChangePasswordModal from "./changePassword/ChangePasswordModal";
import GetPremiumModal from "./changePassword/GetPremiumModal";

import { FaUserAlt, FaEnvelope, FaMale, FaStar, FaBaby, FaMoneyCheck, FaLock, FaPencilAlt } from "react-icons/fa"
import userDataHelper from "../../helpers/userData";

import '../../styles/scss/pagesComponents/userPanel/userPanel.scss'
import '../../styles/scss/pagesComponents/userPanel/576.scss'
import '../../styles/scss/pagesComponents/userPanel/769.scss'

const UserPanel = () => {
  //@ts-ignore
  const { user } = useContext(UserContext)
  const [showChangeInfoModal, setShowChangeInfoModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showGetPremiumModal, setShowGetPremiumModal] = useState(false)

  if (!user) {
    return (
      <WholePageLoading text="Loading user data..." size="xl"/>
    )
  }

  return (
    <Card className="user-panel-container">
      <UserAvatar userId={user._id} premium={user.premium} canChange={true} className="user-avatar"/>
      <div className="informations">
        {/* <h2>Informations</h2> */}
        {user.premium ? <div className="premium-label">PREMIUM</div> : null}
        <p><FaUserAlt/> {user.name}</p>
        <p><FaEnvelope/> {user.email}</p>
        <p><FaStar/> Promiotions left: {user.premium ? "infinite" : Math.floor(user.promotionEvents)}</p>
        <p><FaMale/> Gender: {user.sex}</p>
        <p><FaBaby/> Age: {userDataHelper.countYears(user.age)}</p>
      </div>
      <div className="user-panel-actions">
        <button className="action-button" onClick={() => setShowChangeInfoModal(true)}><FaPencilAlt/> Change user data</button>
        <button className="action-button" onClick={() => setShowChangePasswordModal(true)}><FaLock/> Change password</button>
        <button className="action-button" onClick={() => setShowGetPremiumModal(true)}><FaMoneyCheck/> Get premium</button>
      </div>
      <ChangeInfoModal isOpen={showChangeInfoModal} setOpen={setShowChangeInfoModal} profileData={{
        name: user.name,
        age: user.age,
        gender: user.sex
      }}/>
      <ChangePasswordModal isOpen={showChangePasswordModal} setOpen={setShowChangePasswordModal}/>
      <GetPremiumModal isOpen={showGetPremiumModal} setOpen={setShowGetPremiumModal} />
    </Card>
  );
};

export default UserPanel;
