import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { IFilter } from './models/IProduct.js'

export const FiltersFreeId = 'FFI'
export const FiltersList = 'FL'

class FiltersDB {
  async OpenDB () {
    return open({
      filename: process.env.DB_PATH || 'sqlite3.db',
      driver: sqlite3.Database
    })
  }
  async Insert (items: IFilter[]) {
    const db = await this.OpenDB()
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const res: { ID: number } | undefined = await db.get(
        `SELECT ID FROM ${FiltersFreeId}`
      )
      if (res) {
        await db.exec(
          `INSERT INTO ${FiltersList} VALUES (${res.ID},${item.LID} ,"${item.NAME}")`
        )
        await db.exec(
          `UPDATE ${FiltersFreeId} SET ID=${res.ID + 1} WHERE ID=${res.ID}`
        )
      }
    }
    await db.close()
  }

  async Update (items: IFilter[]) {
    const db = await this.OpenDB()

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      await db.exec(
        `UPDATE ${FiltersList} SET NAME=${item.NAME} WHERE ID=${item.ID}`
      )
    }
    await db.close()
  }

  async Delete (ids: number[]) {
    const db = await this.OpenDB()

    for (let i = 0; i < ids.length; i++) {
      const e = ids[i]
      await db.exec(`DELETE FROM ${FiltersList} WHERE ID=${e}`)
    }

    await db.close()
  }

  async GetAll () {
    const db = await this.OpenDB()
    const res: IFilter[] = await db.all(`SELECT * FROM ${FiltersList}`)
    await db.close()
    return res
  }
}

export default new FiltersDB()
