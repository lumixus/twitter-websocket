const initialState = {
    user: {},
    loading: false
}


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USER":
            return {...state, user: action.payload};
        case "LOGOUT_REQUEST":
            return {...state, loading: true};
        case "LOGOUT_SUCCESS":
            return {...state, user: {}, loading: false}
        default:
            return state;
    }
}

export default userReducer;