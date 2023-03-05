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
            <div>@{user.username}</div>
        </div>
        <div className={style.icon}>Icon</div>
    </div>
  )
}

export default ProfileBox