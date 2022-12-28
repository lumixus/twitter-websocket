import {createSlice, configureStore} from "@reduxjs/toolkit"


const userSlice = createSlice({
name : "user",
initialState : {
    user: {}
},
reducers : {
    setUser: state => {
        state.user = {username : "emirtaskin"}
    }
}
})

const store = configureStore({
reducer : userSlice.reducer
})


export const {setUser} = userSlice.actions


export default store



