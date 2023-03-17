import axios from "axios"
import { CREATE_TWEET_FAILED, CREATE_TWEET_REQUEST, CREATE_TWEET_SUCCESS, GET_TWEET_FEED_REQUEST, GET_TWEET_FEED_SUCCESS } from "../Consts/tweetConsts";

export const getTweetFeed = () => async (dispatch) => {
    try {
        dispatch({type: GET_TWEET_FEED_REQUEST});
        const {data} = await axios.get("http://localhost:8080/feed", {withCredentials: true});
        console.log(data);
        dispatch({type: GET_TWEET_FEED_SUCCESS, payload: data.data});
    } catch (err) {
        dispatch({type: GET_TWEET_FEED_SUCCESS, payload: []});
    }
}


export const newTweet = (tweetData) => async (dispatch) => {
    try {
        dispatch({type: CREATE_TWEET_REQUEST});
        const {data} = await axios.post("http://localhost:8080/tweet/create", {content: tweetData.content}, {withCredentials: true});
        dispatch({type: CREATE_TWEET_SUCCESS, payload: data})
    } catch (error) {
        dispatch({type: CREATE_TWEET_FAILED, payload: error})
    }

}