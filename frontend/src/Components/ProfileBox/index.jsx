import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import style from "./ProfileBox.module.css";
import {useDispatch, useSelector} from "react-redux"



import React, { useState } from 'react'
import { logoutUser } from "../../Store/Actions/userActions";

const ProfileBox = ({user}) => {
  const userState = useSelector(state => state.user);

  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutUser());
    window.location.reload();
  }


  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={(e) => setIsOpen(!isOpen)} className={style.boxWrapper}>
      {isOpen ? 
      <div className={style.profileBoxMenu}>
          <button onClick={(e) => logout()} className={style.logoutButton}>Logout @{user.username}</button>
      </div> : ""}
        <div className={style.profilePicture}>
            <img src={`http://localhost:8080/uploads/${user.profilePicture}`} alt="" />
        </div>
        <div className={style.middleSection}>
            <div>{user.name}</div>
            <div style={{color: "rgb(113, 118, 123)"}}>@{user.username}</div>
        </div>
        <div className={style.icon}><FontAwesomeIcon icon={faEllipsis} /></div>
    </div>
  )
}

export default ProfileBox