import dotenv from "dotenv"
import express from "express"
import cors from 'cors';
import path from "path"
import { updatePages, readDatabase, getDataBaseFormat } from './NotionInterface.js';

dotenv.config({ DB_ID: process.env.DATABASE_ID });

//get file absolute path
const __dirname = path.resolve()
const DB_ID = process.env.DATABASE_ID

const WIDGET_LIST = {
    "clock": {
        "requestPath": "./widget/widget-tools/clock/index.html",
        'staticPath': ['widget/widget-tools/clock']
    },
    "fold-card": {
        "requestPath": "./widget/widget-tools/fold-card/index.html",
        'staticPath': ['widget/widget-tools/fold-card']
    }
}
/**************************************
 *          Setting config
 **************************************/

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
const staticSetting = (widgetKey = "clock") => {
    var staticPathList = WIDGET_LIST[widgetKey].staticPath
    console.log(staticPathList)
    staticPathList.forEach((staticPath) => {
        app.use(express.static(path.join(__dirname, staticPath)))
    })
}
/**
 * middleware router setting
 */
app.use('/widget', function (req, res, next) {
    if (req.query.tool) {
        var toolType = req.query.tool
        var staticList = WIDGET_LIST[toolType]
        if (staticList != undefined) {
            var staticPathList = staticList['staticPath']
            staticPathList.forEach((staticPath) => {
                // console.log(toolType, path.join(__dirname, staticPath))
                app.use(`/${toolType}`, express.static(path.join(__dirname, staticPath)))
            })
        }
    }
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
    res.json({ "Data": "get response~" })
})
app.post('/setPageData', (req, res) => {
    console.log(req.body)

    const { property, type, options } = req.body.data
    var setValue = true
    if (type == "multi_select") {
        setValue = []
        options.forEach(d => { setValue.push({ "name": d }) })
    } else if (type == "status") {
        setValue = { 'name': options[0] }
    } else if (type == 'checkbox') {
        setValue = (options[0] == 'true') ? true : false
    }

    var data = {
        [property]: {
            [type]: setValue
        }
    }
    // console.log(data)
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
