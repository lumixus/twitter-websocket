import React from 'react'
import styles from "./tweetInput.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { newTweet } from '../../Store/Actions/tweetActions'
import { useState } from 'react'

const TweetInput = () => {
    const userState = useSelector(state => state.user)
    const [content, setContent] = useState('');
    const createTweetState = useSelector(state => state.createTweet);
    const dispatch = useDispatch();
    const {loading, error, response} = createTweetState;

    const sendTweet = () => {
        dispatch(newTweet({content: content}));
    }

    const autoGrow = (e) => {

        setContent(e.target.value);

        e.target.style.cssText = 'height:auto; padding:0;'
        e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';
    
    }


  return (
    <>
    {Object.keys(userState).length !== 0 ? 


        <div className={styles.tweetEditor}>
            {loading ? "Tweet sending..." :
            <>
            <div className={styles.profilePic}>
            <img src={`http://localhost:8080/uploads/${userState.user.profilePicture}`} />
            </div>


            <div className={styles.tweetArea}>
                <textarea onChange={(e) => autoGrow(e)} rows={1} placeholder="What's happening?"></textarea>
                <div className={styles.tweetEditorBottom}>
                    <div>
                        buttons
                    </div>
                    <div>
                        <Button onClick={sendTweet} style={{borderRadius:"20px"}}>Tweet</Button>
                    </div>
                </div>
            </div>
            </>
            }
        </div>
            : ""}
  </>)
}

export default TweetInput