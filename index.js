import dotenv from "dotenv"
import express from "express"
import cors from 'cors';
import path from "path"
import { updatePages, readDatabase, getDataBaseFormat } from './NotionInterface.js';

dotenv.config({ DB_ID: process.env.DATABASE_ID });

//get file absolute path
const __dirname = path.resolve()
const DB_ID = process.env.DATABASE_ID
const databaseId = DB_ID

const WIDGET_LIST = {
    "clock": {
        "requestPath": "./widget/widget-tools/clock/index.html",
        'staticPath': 'widget/widget-tools/clock/'
    }
}
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

/**
 * Setting cors options
 * If open origin as *, it means open the gate for all source request
 */
const corsOptions = {
    // origin: "*", 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions))

/**
 * support json-encoded and url-encoded bodies
 * json: express.json()
 * url-encoded: urlencoded as false
 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * static file path
 */
const staticSetting = () => {
    for (const [key, item] of Object.entries(WIDGET_LIST)) {
        app.use(express.static(path.join(__dirname, item['staticPath'])))
    }
}
staticSetting()

/**
 * middleware router setting
 */
app.use(function (req, res, next) {
    // console.log(req.body) // populated!
    next()
})

//widget send html
//http://localhost:port/widget?tool=clock
app.get('/widget', (req, res) => {
    if (req.query.tool) {
        var toolType = req.query.tool
        var localTool = WIDGET_LIST[toolType]
        if (localTool != undefined) {
            res.sendFile(localTool['requestPath'], { root: __dirname })
        } else {
            res.send("Please select your tool type")
        }
    } else {
        res.send("Please select your tool type")
    }
})

/*************************************
 *          API setting method
 *      define get & post request
 *************************************/
app.get('/', (req, res) => {
    //.params is grab specific parameter
    // res.send("Hello", req.params, req.query)
    res.json({ "Data": "get response" })
})
app.post('/setPageData', (req, res) => {
    var data = {
        "Checkbox": {
            checkbox: true
        }
    }
    updatePages(req.body.pageKey, data)

    res.json(req.body)
})
app.post('/getDB', (req, res) => {
    var dbKey = req.body.dbKey
    readDatabase(dbKey).then((dataList) => {
        res.json({ data: dataList })
    })
})
app.post('/getDBFormat', (req, res) => {
    var dbKey = req.body.dbKey
    getDataBaseFormat(dbKey).then((dataList) => {
        res.json({ data: dataList })
    })
})
//server start listen
var server = app.listen(process.env.PORT, () => {
    var host = server.address().address
    var localPort = server.address().port
    console.log(`Server start at ${host}:${localPort}`)
})
