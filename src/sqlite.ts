import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { IProduct } from './models/IProduct.js'

class DataWork {

    async openDb() {
        return open({
            filename: './database.db',
            driver: sqlite3.Database
        });
    }

    async createDefault() {
        const db = await this.openDb();
        await db.exec('CREATE TABLE IF NOT EXISTS PRODUCT (ID INT, TITLE TEXT, BRAND INT, TYPE INT, IMG TEXT, PRICE INT, INSTOCK INT)')
        await db.exec('CREATE TABLE IF NOT EXISTS LASTID (ID INT)')
        const res: { ID: number } | undefined = await db.get(`SELECT ID FROM LASTID`)
        if (res === undefined) {
            await db.exec(`INSERT INTO LASTID VALUES (0)`)
        }
        await db.close();
    }

    async insertProduct(item: IProduct) {
        const db = await this.openDb();
        const res: { ID: number } | undefined = await db.get(`SELECT ID FROM LASTID`)
        if (res) {
            await db.exec(`INSERT INTO PRODUCT VALUES (${res.ID}, "${item.title}", ${item.brand}, ${item.category}, "${item.img}", ${item.price}, ${item.available})`)
            await db.exec(`UPDATE LASTID SET ID=${res.ID + 1} WHERE ID=${res.ID}`)
        }
        await db.close();
    }

    async removeProduct(id: number) {
        const db = await this.openDb();
        await db.exec(`DELETE FROM PRODUCT WHERE ID=${id}`)
        await db.close();
    }

    async getProduct(id: number) {
        const db = await this.openDb();
        const res: IProduct | undefined = await db.get(`SELECT * FROM PRODUCT WHERE ID=${id}`)
        if (res) {
            await db.close();
            return res;
        }
        else {
            await db.close();
            return false;
        }
    }

    async getProducts() {
        const db = await this.openDb();
        const res: IProduct[] = await db.all(`SELECT * FROM PRODUCT`)
        await db.close();
        return res;
    }
}

export default new DataWork