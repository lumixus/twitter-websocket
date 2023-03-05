import style from "./ProfileBox.module.css";



import React from 'react'

const ProfileBox = ({user}) => {
  return (
    <div className={style.boxWrapper}>
        {user.username} {user.email}
    </div>
  )
}

export default ProfileBox