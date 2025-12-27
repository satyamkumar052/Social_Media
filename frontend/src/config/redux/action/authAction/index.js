import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {
            
            const response = await clientServer.post("/login", {
                email : user.email,
                password : user.password
            });

            if(response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                thunkAPI.rejectWithValue({message:"token not provided"});
            }

            thunkAPI.fulfillWithValue(response.data);


        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        
    }
)