import axios from "axios";

export const getUser = () => async (dispatch) => {
    try {
        const {data} = await axios.get("http://localhost:8080/auth/getUser", {withCredentials: true});
        dispatch({type: "GET_USER", payload: data.user});
    } catch (err) {
        console.log(err);
        dispatch({type: "GET_USER", payload: {}});
    }
}


export const logoutUser = () => async (dispatch) => {
    try {
        dispatch({type: "LOGOUT_REQUEST"})
        const {data} = await axios.get("http://localhost:8080/auth/logout", {withCredentials: true});
        dispatch({type: "LOGOUT_SUCCESS"})
    } catch (error) {
        console.log(error);
    }
}