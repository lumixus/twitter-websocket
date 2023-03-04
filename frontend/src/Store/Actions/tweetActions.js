import axios from "axios"

export const getTweetFeed = () => async (dispatch) => {
    try {
        dispatch({type: "GET_TWEET_FEED_REQUEST"});
        const {data} = await axios.get("http://localhost:8080/feed", {withCredentials: true});
        console.log(data);
        dispatch({type: "GET_TWEET_FEED_SUCCESS", payload: data.data});
    } catch (err) {
        dispatch({type: "GET_TWEET_FEED_SUCCESS", payload: []});
    }
}