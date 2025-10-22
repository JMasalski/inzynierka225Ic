import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {createRoot} from "./lib/createRoot.js";
import authRouter from "./routes/auth.route.js";
import onboardingRouter from "./routes/onboarding.route.js";
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(cookieParser())



app.use('/api/v1/auth',authRouter);
app.use('/api/v1/onboarding',onboardingRouter);


const port = process.env.PORT || 4000;




app.listen(port,()=>{
    createRoot()
    console.log(`Server started on port ${port}`);
})