import { NextFunction, Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import { IProduct } from './models/IProduct.js'
import { Verify } from './service/verifyProduct.js'
import DataWork from './sqlite.js'
import FiltersDB from './filters.js'
import { UploadedFile } from 'express-fileupload'
import { v4 as uuidv4 } from 'uuid'

const __dirname = path.resolve()

class Controller {
  GetFilters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = await FiltersDB.GetAll()
      return res.json(filters)
    } catch (e) {
      next(e)
    }
  }

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await DataWork.getProducts()
      return res.json(products)
    } catch (e) {
      next(e)
    }
  }

  getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await DataWork.getProduct(Number(req.params.id))
      if (product) {
        return res.json(product)
      } else return res.sendStatus(404)
    } catch (e) {
      next(e)
    }
  }

  deleteProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (await DataWork.verifyToken(undefined, req.cookies.httpToken)) {
        const items: number[] = req.body
        await DataWork.removeProducts(items)
        await this.checkFileUsage()
        return res.sendStatus(200)
      } else return res.sendStatus(401)
    } catch (e) {
      next(e)
    }
  }

  updateProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (await DataWork.verifyToken(undefined, req.cookies.httpToken)) {
        const items: IProduct[] = req.body
        await DataWork.updateProducts(items)
        return res.sendStatus(200)
      } else return res.sendStatus(401)
    } catch (e) {
      next(e)
    }
  }

  insertProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (await DataWork.verifyToken(undefined, req.cookies.httpToken)) {
        const item: IProduct = req.body
        const dbRes = await DataWork.insertProduct(item)
        if (!dbRes) return res.sendStatus(400)
        return res.json(dbRes)
      } else return res.sendStatus(401)
    } catch (e) {
      next(e)
    }
  }

  insertProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (await DataWork.verifyToken(undefined, req.cookies.httpToken)) {
        const items: IProduct[] = req.body
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (!Verify(item)) {
            return res.sendStatus(400)
          }
        }
        await DataWork.insertProducts(items)
        return res.sendStatus(200)
      } else return res.sendStatus(401)
    } catch (e) {
      next(e)
    }
  }

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (await DataWork.verifyToken(undefined, req.cookies.httpToken)) {
        if (!req.files) return res.sendStatus(400)
        const image = req.files.img as UploadedFile
        const filename = uuidv4() + '.jpg'
        image.mv(path.resolve(__dirname, 'static', filename))
        return res.json({ filename })
      } else return res.sendStatus(401)
    } catch (e) {
      next(e)
    }
  }

  getFreeId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ID = await DataWork.getFreeId()
      if (ID) {
        return res.json({ ID })
      }
      return res.sendStatus(400)
    } catch (e) {
      next(e)
    }
  }

  checkFileUsage = async () => {
    try {
      const items = await DataWork.getProducts()
      fs.readdir(path.resolve(__dirname, 'static'), (err, files) => {
        if (err) {
          process.exit(1)
        }
        for (let i = 0; i < files.length; i++) {
          const e = files[i]
          let inUse = false
          for (let y = 0; y < items.length; y++) {
            const img = items[y].IMG
            if (img === e) {
              inUse = true
              break
            }
          }
          if (!inUse) {
            fs.unlinkSync(path.resolve(__dirname, 'static', e))
          }
        }
        return true
      })
    } catch (e) {
      return false
    }
  }

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const htoken = req.cookies.httpToken
      const answer = await DataWork.verifyToken(undefined, htoken)
      if (answer) {
        return res.sendStatus(202)
      }
      return res.sendStatus(401)
    } catch (e) {
      next(e)
    }
  }

  verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Verify User')

      const { login, password }: { login: string; password: string } = req.body
      const answer = await DataWork.verifyUser(login, password)
      if (answer === 2) return res.json({ err: 2 })
      if (answer === 3) return res.json({ err: 3 })

      res.cookie('httpToken', '8stf1hqcr93xjk', {
        maxAge: 1 * 14 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })
      return res.json(answer)
    } catch (e) {
      return res.json(505)
      next(e)
    }
  }
}

export default new Controller()
