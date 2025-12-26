import express from 'express';
const app = express();


import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserRouter from "./routes/user.routes.js";
import PostRouter from "./routes/posts.routes.js";
dotenv.config();


// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));


const start = () => {
    mongoose.connect(process.env.MONGOURL)
    .then(() => console.log('Connected!'));
};

app.use("/", UserRouter);
app.use("/", PostRouter);

app.listen(8080, () => {
    console.log("Server running on 8080");
    start();
});

