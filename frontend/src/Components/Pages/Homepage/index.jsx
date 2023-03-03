import React from 'react'
import { useState } from 'react'
import TweetCard from '../../TweetCard'
import styles from './Homepage.module.css'
import axios from "axios"
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getTweetFeed } from '../../../Store/Actions/tweetActions'

const Homepage = () => {
    
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user)
    const {tweets, loading} = useSelector(state => state.tweet)


    useEffect(() => {
        dispatch(getTweetFeed());
    }, [])


    const autoGrow = (e) => {

    e.target.style.cssText = 'height:auto; padding:0;'
    e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';

    }




  return (
    <div className={styles.main}>
    {Object.keys(userState).length !== 0 ? 


        <div className={styles.tweetEditor}>
            <div className={styles.profilePic}>
            Image
            </div>


            <div className={styles.tweetArea}>
                <textarea onChange={(e) => autoGrow(e)} rows={1} placeholder="What's happening?"></textarea>
                <div className={styles.tweetEditorBottom}>
                    <div>
                        buttons
                    </div>
                    <div>
                        <Button style={{borderRadius:"20px"}}>Tweet</Button>
                    </div>
                </div>
            </div>
        </div>
            : ""}

        <hr />


        {loading ? 
        "Loading..." : 
        tweets ? tweets.map(t => <TweetCard tweet={t} key={t.id} />) : null}

    </div>
  )
}

export default Homepage