import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TweetCard from '../../TweetCard';
import { useEffect } from 'react';
import { getProfileFeed } from '../../../Store/Actions/profileActions';
import { useParams } from 'react-router-dom';
import ProfileSection from '../../ProfileSection';

const Profile = () => {
    const dispatch = useDispatch();
    const profileState = useSelector(state => state.profile);
    const createTweetState = useSelector(state => state.createTweet);

    const {tweets, user, error, loading} = profileState;
    let { username } = useParams();

    useEffect(() => {
            dispatch(getProfileFeed(username));
    },[createTweetState])

  return (
    <>
        {loading ? "Loading..." : Object.keys(user).length === 0 ? "There is no user with this username: " + username : 
        <>
          <ProfileSection />
          {Object.keys(tweets).length !== 0 ? tweets.map(t => <TweetCard tweet={t} />) : "There is no tweet belongs to this user"}
        </>


    }
    </>
  )
}

export default Profile