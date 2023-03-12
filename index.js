import dotenv from "dotenv"
import express from "express"
import cors from 'cors';
import bodyParser from "body-parser"
import { updatePages, readDatabase } from './NotionInterface.js';

dotenv.config({ DB_ID: process.env.DATABASE_ID });

const DB_ID = process.env.DATABASE_ID
const databaseId = DB_ID
/**************************************
 *          Setting config
 **************************************/
const db_filter = {
    // property: "Checkbox",
    // "checkbox": {
    //     'equals': true
    // }
}
// readDatabase(databaseId, db_filter)
//     .then((dbList) => {
//         console.log(dbList)
//     })
// updatePages('0104c2c4-64f6-438a-aaf6-103731d25817')
// console.log(notion.databases.update)

/**************************************
 *          Server start
 **************************************/
var app = express()

//support json-encoded and url-encoded bodies
const corsOptions = {
    origin: "*",
    // preflightContinue: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions))

// parse application/json
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//router
app.use(function (req, res, next) {
    console.log(req.body) // populated!
    next()
})

//define get & post request
app.get('/', (req, res) => {
    //.params is grab specific parameter
    // res.send("Hello", req.params, req.query)
    res.json({ "Data": "get response" })
})
app.post('/', (req, res) => {
    console.log("post get ", req.body)
    res.json(req.body)
})

//server start listen
var server = app.listen(process.env.PORT, () => {
    var host = server.address().address
    var localPort = server.address().port
    console.log(`Server start at ${host}:${localPort}`)
})
