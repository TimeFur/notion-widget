import { Client } from "@notionhq/client"
import dotenv from "dotenv"
dotenv.config({ KEY: process.env.NOTION_KEY, DB_ID: process.env.DATABASE_ID });

/**************************************
 *          Notion instance
 **************************************/
const notion = new Client({ auth: process.env.NOTION_KEY })

/**
 * Add Item into notion db
 * @param {*} text 
 */
async function addItem(text, dbId) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: dbId },
            properties: {
                title: {
                    title: [
                        {
                            "text": {
                                "content": text
                            }
                        }
                    ]
                }
            },
        })
        console.log(response)
        console.log("Success! Entry added.")
    } catch (error) {
        console.error(error.body)
    }
}

const readDatabase = async (dbId, queryFilter = {}) => {
    return new Promise((resolve) => {
        var dbList = []
        notion.databases.query({
            database_id: dbId/*, filter: queryFilter*/
        }).then(pages => {
            pages.results.forEach(item => {
                dbList.push({ page: item.id, properties: item.properties })
            })

            resolve(dbList)
        })
    })
}

const getDataBaseFormat = async (dbId) => {
    return new Promise((resolve) => {
        notion.databases.retrieve({
            database_id: dbId
        }).then(format => {
            resolve(format)
        })
    })
}
const readPage = async () => {

}
const updatePages = async (pageId, data) => {
    console.log(pageId)
    notion.pages.update({
        page_id: pageId,
        properties: data
    })
}

export {
    updatePages,
    readDatabase,
    getDataBaseFormat
}