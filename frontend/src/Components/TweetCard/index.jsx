import React from 'react'
import styles from './TweetCard.module.css'
import moment from "moment"


const TweetCard = ({tweet}) => {
  return (
    <>
    <div className={styles.tweetCard}>
        <div className={styles.profilePic}>
            IMAGE
        </div>
        <div className={styles.rightSide}>
            <div className={styles.topSide}>
                <div style={{display:"flex", flexDirection:"row"}}>
                    <p style={{fontWeight:"bold"}}>Tumer Altunbas</p> 
                    <span style={{marginLeft:"10px"}}>@tumeraltunbas</span>
                    <span style={{marginLeft:"5px"}}>·</span>
                    <span style={{marginLeft:"5px"}}>{moment(tweet.createdAt).fromNow()}</span>
                </div>
                <div>buttons</div>
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