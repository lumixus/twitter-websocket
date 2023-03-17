import { CREATE_TWEET_FAILED, CREATE_TWEET_REQUEST, CREATE_TWEET_SUCCESS } from "../Consts/tweetConsts";

const initialState = {
    loading: false,
    error: '',
    response: null
}



const createTweetReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_TWEET_REQUEST:
            return {...state, response: null, error: '', loading: true}
        
        case CREATE_TWEET_SUCCESS:
            return {...state, response: action.payload, error: '', loading: false}

        case CREATE_TWEET_FAILED:
            return {...state, response: null, error: action.payload, loading: false}
        default:
            return state;
    }

}

export default createTweetReducer;
