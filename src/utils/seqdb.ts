import { openDb } from './opendb.js'
import { ProductsList } from '../sqlite.js'

export const createDefault = async () => {
  const db = await openDb()

  await db.exec(
    `CREATE TABLE IF NOT EXISTS ${ProductsList} (ID INT, TITLE TEXT, BRAND INT, TYPE INT, IMG TEXT, PRICE INT, INSTOCK INT)`
  )
  await db.exec('CREATE TABLE IF NOT EXISTS LASTID (ID INT)')
  const res: { ID: number } | undefined = await db.get(`SELECT ID FROM LASTID`)
  if (res === undefined) {
    await db.exec(`INSERT INTO LASTID VALUES (0)`)
  }

  await db.close()
}
