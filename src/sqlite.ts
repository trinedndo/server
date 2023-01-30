import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { IFilter, IProduct } from './models/IProduct.js'
import md5 from 'md5'
import { openDb } from './utils/opendb.js'

export const ProductsList = 'PL'

const filters = [
  {
    ID: 0,
    LID: 0,
    NAME: 'Festool'
  },
  {
    ID: 0,
    LID: 0,
    NAME: 'Bosch'
  },
  {
    ID: 0,
    LID: 0,
    NAME: 'Miluware'
  },
  {
    ID: 1,
    LID: 0,
    NAME: 'Скороварки'
  },
  {
    ID: 1,
    LID: 0,
    NAME: 'Кастрюли'
  },
  {
    ID: 1,
    LID: 0,
    NAME: 'Ножницы'
  }
]

class DataWork {
  // async openDb () {
  //   return open({
  //     filename: process.env.DB_PATH || 'sqlite3.db',
  //     driver: sqlite3.Database
  //   })
  // }

  async getFreeId () {
    const db = await openDb()
    const res: { ID: number } | undefined = await db.get(
      `SELECT ID FROM LASTID`
    )
    await db.close()
    if (res) return res.ID
    return false
  }

  async insertProduct (item: IProduct) {
    const db = await openDb()
    const res: { ID: number } | undefined = await db.get(
      `SELECT ID FROM LASTID`
    )
    if (!res) return false
    await db.exec(
      `INSERT INTO ${ProductsList} VALUES (${res.ID}, "${item.TITLE}", ${item.BRAND}, ${item.TYPE}, "${item.IMG}", ${item.PRICE}, ${item.INSTOCK})`
    )
    await db.exec(`UPDATE LASTID SET ID=${res.ID + 1} WHERE ID=${res.ID}`)
    await db.close()
    return { ID: res.ID, IMG: item.IMG }
  }

  async insertProducts (items: IProduct[]) {
    const db = await openDb()
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const res: { ID: number } | undefined = await db.get(
        `SELECT ID FROM LASTID`
      )
      if (res) {
        await db.exec(
          `INSERT INTO ${ProductsList} VALUES (${res.ID}, "${item.TITLE}", ${item.BRAND}, ${item.TYPE}, "${item.IMG}", ${item.PRICE}, ${item.INSTOCK})`
        )
        await db.exec(`UPDATE LASTID SET ID=${res.ID + 1} WHERE ID=${res.ID}`)
      }
    }
    await db.close()
  }

  async removeProduct (id: number) {
    const db = await openDb()
    await db.exec(`DELETE FROM ${ProductsList} WHERE ID=${id}`)
    await db.close()
  }

  async removeProducts (ids: number[]) {
    const db = await openDb()

    for (let i = 0; i < ids.length; i++) {
      const e = ids[i]
      await db.exec(`DELETE FROM ${ProductsList} WHERE ID=${e}`)
    }

    await db.close()
  }

  async updateProduct (item: IProduct) {
    const db = await openDb()

    await db.exec(
      `UPDATE ${ProductsList} SET TITLE="${item.TITLE}", BRAND=${item.BRAND}, TYPE=${item.TYPE}, IMG="${item.IMG}", PRICE=${item.PRICE}, INSTOCK=${item.INSTOCK} WHERE ID=${item.ID}`
    )
    await db.close()
  }

  async updateProducts (items: IProduct[]) {
    const db = await openDb()

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      await db.exec(
        `UPDATE ${ProductsList} SET TITLE="${item.TITLE}", BRAND=${item.BRAND}, TYPE=${item.TYPE}, IMG="${item.IMG}", PRICE=${item.PRICE}, INSTOCK=${item.INSTOCK} WHERE ID=${item.ID}`
      )
    }
    await db.close()
  }

  async getProduct (id: number) {
    const db = await openDb()
    const res: IProduct | undefined = await db.get(
      `SELECT * FROM ${ProductsList} WHERE ID=${id}`
    )
    if (res) {
      await db.close()
      return res
    } else {
      await db.close()
      return false
    }
  }

  async getProducts () {
    const db = await openDb()
    const res: IProduct[] = await db.all(`SELECT * FROM ${ProductsList}`)
    await db.close()
    return res
  }

  async verifyToken (token?: string, httpToken?: string) {
    if (token) {
      const tokenOrig = 'a7939496-dc9b-4147-965c-f574de4bf922'
      if (md5(tokenOrig) === token) return true
      return false
    }

    if (httpToken) {
      const token = '8stf1hqcr93xjk'
      if (httpToken === token) return true
      return false
    }

    return false
  }

  async verifyUser (login: string, password: string) {
    const token = 'a7939496-dc9b-4147-965c-f574de4bf922'
    const originalLogin = 'a14dbe401885797b43ce9d66e98968c3'
    const originalPassword = '4349bb44c925434ca6963e24e2263640'
    const md5Login = md5(login)
    const md5Password = md5(password)
    if (md5Login !== originalLogin) return 2
    if (md5Password !== originalPassword) return 3
    return { token: md5(token) }
  }
}

export default new DataWork()
