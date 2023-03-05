import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import style from "./ProfileBox.module.css";



import React from 'react'

const ProfileBox = ({user}) => {
  return (
    <div className={style.boxWrapper}>
        <div className={style.profilePicture}>
            <img src={`http://localhost:8080/uploads/default.png`} alt="" />
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