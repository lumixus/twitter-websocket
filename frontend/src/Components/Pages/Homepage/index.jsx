import React from 'react'
import { useState } from 'react'
import TweetCard from '../../TweetCard'
import styles from './Homepage.module.css'
import axios from "axios"
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Homepage = () => {

    const [tweets, setTweets] = useState([])
    const [tweetsLoading, setTweetsLoading] = useState(true)

    const userState = useSelector((state) => state.user)

    const getTweets = async () => {

        setTweetsLoading(true)

        const {data} = await axios.get("http://localhost:8080/auth/profile", {headers : {
            authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJsdW1peHVzIiwiaWF0IjoxNjcxOTAxMTg3LCJleHAiOjE2NzI0MTcxODd9.tZwjQVxbXBAd5stziCa2N0CE7oe7qLFCI-LtcFRK_QU"
        }})

        setTweets(data.tweets)
        setTweetsLoading(false)

    }


    useEffect(() => {
        if(tweets.length === 0){
            getTweets()
        }
    }, [tweets])


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


        {tweetsLoading ? 
        "Loading..." : 
        tweets ? tweets.map(t => <TweetCard tweet={t} key={t.id} />) : null}

    </div>
  )
}

export default Homepage