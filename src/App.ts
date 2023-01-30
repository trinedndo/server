import * as dotenv from 'dotenv'
dotenv.config()
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import path from 'path'

import router from './routes.js'
import { createDefault } from './utils/seqdb.js'

const __dirname = path.resolve()
const PORT = process.env.PORT || 5000
const app = express()
const origins = process.env.CLIENT_URL
const json = origins ? JSON.parse(origins) : ['*']
const corsOpt = {
  origin: json,
  credentials: true
}

app.use(cors(corsOpt))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cookieParser())
app.use(fileUpload({}))
app.use('/api', router)

const start = async () => {
  try {
    await createDefault()
    app.listen(PORT, () => {
      console.log(`Server Started on PORT: ` + PORT)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
