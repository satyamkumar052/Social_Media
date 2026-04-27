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
    .then(() => console.log('Connected!'))
    .catch((err) => console.log(err));
};

app.use("/", UserRouter);
app.use("/", PostRouter);

const PORT = process.env.PORT || 8080;

app.get("/health", (_, res) => {
    res.status(200).json({ ok: true, service: "backend" });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    start();
});

