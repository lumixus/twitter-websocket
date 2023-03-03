import { combineReducers } from "redux";
import userReducer from "./userReducer";
import tweetReducer from "./tweetReducer";





const rootReducer = combineReducers({
    user: userReducer,
    tweet: tweetReducer
})


export default rootReducer;