import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'
import { IProduct } from '../models/IProduct.js'

class DataWork {

    async openDb() {
        try {
            const db = await open({
                filename: './database.db',
                driver: sqlite3.Database
            })
            await db.exec('CREATE TABLE IF NOT EXISTS PRODUCT (ID INT, TITLE TEXT, BRAND INT, TYPE INT, IMG TEXT, PRICE INT, INSTOCK INT)')
            await db.exec('CREATE TABLE IF NOT EXISTS LASTID (ID INT)')

            const res: { ID: number } | undefined = await db.get(`SELECT ID FROM LASTID`)
            if (res === undefined) {
                await db.exec(`INSERT INTO LASTID VALUES (0)`)
            }
            return db;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    insertProduct = async ({ item, db }: { item: IProduct, db: Database<sqlite3.Database, sqlite3.Statement> }) => {
        const res: { ID: number } | undefined = await db.get(`SELECT ID FROM LASTID`)
        if (res) {
            await db.exec(`INSERT INTO PRODUCT VALUES (${res.ID}, "${item.title}", ${item.brand}, ${item.category}, "${item.img}", ${item.price}, ${item.available})`)
            await db.exec(`UPDATE LASTID SET ID=${res.ID + 1} WHERE ID=${res.ID}`)
        }
        return;
    }

    removeProduct = async ({ id, db }: { id: number, db: Database<sqlite3.Database, sqlite3.Statement> }) => {
        await db.exec(`DELETE FROM PRODUCT WHERE ID=${id}`)
        return;
    }

    getProduct = async ({ id, db }: { id: number, db: Database<sqlite3.Database, sqlite3.Statement> }) => {
        const res: IProduct | undefined = await db.get(`SELECT * FROM PRODUCT WHERE ID=${id}`)
        if (res) {
            return res;
        }
        else {
            return false;
        }
    }

    getProducts = async ({ db }: { db: Database<sqlite3.Database, sqlite3.Statement> }) => {
        const res: IProduct[] = await db.all(`SELECT * FROM PRODUCT`)
        return res;
    }
}

export default new DataWork