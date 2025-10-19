import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {createRoot} from "./lib/createRoot.js";
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
dotenv.config()
const port = process.env.PORT || 4000;

app.listen(port,()=>{
    createRoot()
    console.log(`Server started on port ${port}`);
})