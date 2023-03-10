import dotenv from "dotenv"
import express from "express"
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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//define get & post request
app.get('/', (req, res) => {
    //.params is grab specific parameter
    res.send("Hello", req.params, req.query)

})
app.post('/updatePage', (req, res) => {
    console.log(req.body)
})

//server start listen
var server = app.listen(process.env.PORT, () => {
    var host = server.address().address
    var localPort = server.address().port
})
