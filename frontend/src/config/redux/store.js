import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";



/* 

STEPS for State Management

Submit Action
Handle Action in it's reducer
Register here => Reducer

*/



export const store = configureStore({
    reducer:{
        auth : authReducer
    }
})
