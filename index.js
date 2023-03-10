import dotenv from "dotenv"
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
readDatabase(databaseId, db_filter)
    .then((dbList) => {
        console.log(dbList)
    })
// updatePages('0104c2c4-64f6-438a-aaf6-103731d25817')
// console.log(notion.databases.update)