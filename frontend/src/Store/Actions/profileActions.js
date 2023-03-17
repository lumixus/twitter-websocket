import axios from "axios";
import { GET_PROFILE_FEED_FAILED, GET_PROFILE_FEED_SUCCESS } from "../Consts/profileFeedConsts"

export const getProfileFeed = (username) => async (dispatch) => {
    try {
        const {data} = await axios.post("http://localhost:8080/user/profile", {user_id: username}, {withCredentials: true})
        dispatch({type: GET_PROFILE_FEED_SUCCESS, payload: data});
    } catch (error) {
        dispatch({type: GET_PROFILE_FEED_FAILED, payload: error});
    }

}
