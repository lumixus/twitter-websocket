import React from 'react'
import styles from './TweetCard.module.css'
import moment from "moment"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEllipsis} from '@fortawesome/free-solid-svg-icons'


const TweetCard = ({tweet}) => {
  return (
    <>
    <div className={styles.tweetCard}>
        <div className={styles.profilePic}>
            <img src="default_profile_normal.png" alt="" />
        </div>
        <div className={styles.rightSide}>
            <div className={styles.topSide}>
                <div style={{display:"flex", flexDirection:"row"}}>
                    <p style={{fontWeight:"bold"}}>{tweet.name}</p> 
                    <span style={{marginLeft:"10px"}}>@{tweet.username}</span>
                    <span style={{marginLeft:"5px"}}>·</span>
                    <span style={{marginLeft:"5px"}}>{moment(tweet.createdAt).fromNow()}</span>
                </div>
                <div>
                    <FontAwesomeIcon icon={faEllipsis} />
                </div>
            </div>
            <div>
                {tweet.content}
            </div>
        </div>
    </div>
    <hr />
    </>
  )
}

export default TweetCard