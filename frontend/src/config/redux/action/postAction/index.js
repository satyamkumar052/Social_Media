import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async( _ ,thunkAPI) => {
        try {
            
            const response = await clientServer.get("/posts");

            if(!response.data) {
                return thunkAPI.rejectWithValue({message : "can't get posts"});
            }

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)