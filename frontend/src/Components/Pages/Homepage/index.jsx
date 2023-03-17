import React from 'react'
import { useState } from 'react'
import TweetCard from '../../TweetCard'
import styles from './Homepage.module.css'
import axios from "axios"
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getTweetFeed } from '../../../Store/Actions/tweetActions'
import TweetInput from '../../TweetInput'

const Homepage = () => {
    
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user)
    const {tweets, loading} = useSelector(state => state.tweet)


    useEffect(() => {
        dispatch(getTweetFeed());
    }, [])


  return (
    <div className={styles.main}>

        <TweetInput />
        <hr />


        {loading ? 
        "Loading..." : 
        tweets ? tweets.map(t => <TweetCard tweet={t} key={t.id} />) : null}

    </div>
  )
}

export default Homepage