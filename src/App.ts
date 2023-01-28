import * as dotenv from 'dotenv'
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import router from "./router.js";

dotenv.config()
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
    origin: "*",
    credentials: true
}))

app.use("/api", router);

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server started on PORT: ` + PORT);
        })
    }
    catch (e) {
        console.log(e);
    }
}

start()