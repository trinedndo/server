import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload'
import router from "./router.js";
import DataWork from './sqlite.js'
import path from 'path';

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
const app = express()
const origins = process.env.CLIENT_URL;
const json = origins ? JSON.parse(origins) : ["*"];
const corsOpt = {
    origin: json,
    credentials: true
};

app.use(cors(corsOpt))
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cookieParser());
app.use(fileUpload({}))
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