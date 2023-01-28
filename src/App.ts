import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import router from "./router.js";
import DataWork from './sqlite.js'

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use(cookieParser());

const origins = process.env.CLIENT_URL;

let json: string[] = ['*'];

if (origins !== undefined) {
    json = JSON.parse(origins);
}

app.use(cors({
    origin: json,
    credentials: true
}))

app.use("/api", router);

const start = async () => {
    try {
        await DataWork.createDefault();
        app.listen(PORT, () => {
            console.log(`Server Started on PORT: ` + PORT);
        })
    }
    catch (e) {
        console.log(e);
    }
}

start()