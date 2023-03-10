import { Router } from 'express'
import Controller from './controller.js'
import FiltersDB from './filters.js'

const router = Router()

router.get('/check', Controller.checkFileUsage)
router.get('/new', Controller.getFreeId)
router.post('/upload', Controller.upload)
router.post('/insert', Controller.insertProducts)
router.post('/update', Controller.updateProducts)
router.post('/delete', Controller.deleteProducts)
router.get('/products', Controller.getProducts)
router.get('/products/:id', Controller.getProduct)
router.post('/auth', Controller.verifyUser)
router.post('/autht', Controller.verifyToken)

router.get('/filters', Controller.GetFilters)
router.post('/flins', FiltersDB.Insert)
router.post('/flupd', FiltersDB.Update)
router.post('/fldel', FiltersDB.Delete)

export default router
