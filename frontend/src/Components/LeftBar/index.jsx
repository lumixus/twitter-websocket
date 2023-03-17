import React from 'react'
import styles from "./LeftBar.module.css"
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBookmark, faEllipsisH, faEnvelope, faGear, faHashtag, faHome, faList, faUser } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import TwitterIcon from '../SVGS/TwitterIcon'
import ProfileBox from '../ProfileBox'
import TweetInputModal from '../TweetInputModal'

const LeftBar = () => {

const userState = useSelector((state) => state.user)

const openTweetInputModal = () => {

}



  return (
    <div className={styles.leftBar}>
        <div>
          <div className={styles.linksWrapper}>
            <div style={{width:"250px", marginBottom:"30px"}}>
              <Link to={"/"}>
                <TwitterIcon style={{fill:"currentColor", height: "32px"}} />
              </Link>
            </div>
            {Object.keys(userState).length === 0 ? 
            <>
              <Link to={"/"}>
              <FontAwesomeIcon style={{marginRight:"20px"}} icon={faHashtag}/>
                Explore
              </Link>

              <Link to={"/"}>
              <FontAwesomeIcon style={{marginRight:"20px"}} icon={faGear}/>
              Setting
              </Link>
            </>
            : <>
            <Link to={"/"}>
              <FontAwesomeIcon style={{marginRight:"20px"}} icon={faHome}/>
              Home
            </Link>
            <Link to={"/"}>
              <FontAwesomeIcon style={{marginRight:"20px"}} icon={faHashtag}/>
              Explore
            </Link>
            <Link to={"/"}>
              <FontAwesomeIcon style={{marginRight:"20px"}} icon={faBell}/>
              Notifications
            </Link>
            <Link to={"/"}>
              <FontAwesomeIcon style={{marginRight:"20px"}} icon={faEnvelope}/>
                Messages
            </Link>
            <Link to={"/"}>
              <FontAwesomeIcon style={{marginRight:"20px"}} icon={faBookmark}/>
              Bookmarks
            </Link>
            <Link to={"/"}>
              <FontAwesomeIcon style={{marginRight:"20px"}} icon={faList}/>
              Lists
            </Link>
            <Link to={`/${userState.user.username}`}>
            <FontAwesomeIcon style={{marginRight:"20px"}} icon={faUser}/>
              Profile
            </Link>
            <Link to={"/"}>
            <FontAwesomeIcon style={{marginRight:"20px"}} icon={faEllipsisH}/>
              More
            </Link>

              <TweetInputModal />
            </>}
          </div>
        </div>
        <div style={{width: "40%"}}>
          {Object.keys(userState.user).length === 0 ? "" : <ProfileBox user={userState.user} />}
        </div>
    </div>
  )
}

export default LeftBar