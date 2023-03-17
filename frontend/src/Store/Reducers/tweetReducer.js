import { GET_TWEET_FEED_REQUEST, GET_TWEET_FEED_SUCCESS } from "../Consts/tweetConsts";

const initialState = {
    tweets: [],
    loading: false
}


const tweetReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TWEET_FEED_REQUEST:
            return {...state, loading: true};
        case GET_TWEET_FEED_SUCCESS:
            return {...state, tweets: action.payload, loading: false}
        default:
            return state;
    }
}


export default tweetReducer;