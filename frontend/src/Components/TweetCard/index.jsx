import React from 'react'
import styles from './TweetCard.module.css'
import moment from "moment"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faEllipsis, faComment, faRetweet, faHeart} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'


const TweetCard = ({tweet}) => {
  return (
    <>
    <div className={styles.tweetCard}>
        <div className={styles.profilePic}>
            <img style={{maxHeight: "100%", maxWidth: "100%"}} src="http://localhost:8080/uploads/default.png" alt="" />
        </div>
        <div className={styles.rightSide}>
            <div className={styles.topSide}>
                <div style={{display:"flex", flexDirection:"row"}}>
                    <p style={{fontWeight:"bold"}}><Link style={{color: "white"}} to={`/${tweet.User.username}`}>{tweet.User.name}</Link></p> 
                    <span style={{marginLeft:"10px", color: "gray"}}>@{tweet.User.username}</span>
                    <span style={{marginLeft:"5px", color: "gray"}}>·</span>
                    <span style={{marginLeft:"5px", color: "gray"}}>{moment(tweet.createdAt).fromNow()}</span>
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
    <div className={styles.bottomSide}>
        <div className={styles.tweetIcons}>
            <div>
                <FontAwesomeIcon icon={faComment} />
                <div className={styles.iconValue}>{tweet.mentionCount}</div>
            </div>
            <div>
                <FontAwesomeIcon icon={faRetweet} />
                <div className={styles.iconValue}>{tweet.retweetCount}</div>
            </div>
            <div>
                <FontAwesomeIcon icon={faHeart} />
                <div className={styles.iconValue}>{tweet.favoriteCount}</div>
            </div>
        </div>
    </div>
    </>
  )
}

export default TweetCard