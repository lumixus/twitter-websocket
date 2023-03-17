import { combineReducers } from "redux";
import userReducer from "./userReducer";
import tweetReducer from "./tweetReducer";
import profileFeedReducer from "./profileFeedReducer";
import createTweetReducer from "./createTweetReducer";





const rootReducer = combineReducers({
    user: userReducer,
    tweet: tweetReducer,
    profile: profileFeedReducer,
    createTweet: createTweetReducer
})


export default rootReducer;