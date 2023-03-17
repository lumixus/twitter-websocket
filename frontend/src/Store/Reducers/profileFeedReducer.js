import { GET_PROFILE_FEED_FAILED, GET_PROFILE_FEED_REQUEST, GET_PROFILE_FEED_SUCCESS } from "../Consts/profileFeedConsts";

const initialState = {
    tweets: [],
    user: {},
    loading: false,
    error: ""
}


const profileFeedReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_PROFILE_FEED_REQUEST:
            return {...state, tweets: [], loading: true}
        case GET_PROFILE_FEED_SUCCESS:
            return {...state, user: action.payload.user, tweets: action.payload.tweets, loading: false}
        case GET_PROFILE_FEED_FAILED:
            return {...state, user: {}, tweets: [], loading: false, error: action.payload}
        default:
            return state;
    }
}


export default profileFeedReducer;
