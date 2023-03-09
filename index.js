import { Client } from "@notionhq/client"
import dotenv from "dotenv"
dotenv.config({ KEY: process.env.NOTION_KEY });

const KEY = process.env.NOTION_KEY
const DB_ID = '9a13afce08094487ab65a5065ed7fbd9'

const notion = new Client({ auth: KEY })
const databaseId = DB_ID

/**
 * Add Item into notion db
 * @param {*} text 
 */
async function addItem(text) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
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

addItem("Yurts in Big Sur, California")