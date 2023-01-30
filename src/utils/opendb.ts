import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export const openDb = async () => {
  return open({
    filename: process.env.DB_PATH || 'sqlite3.db',
    driver: sqlite3.Database
  })
}
