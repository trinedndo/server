import { Router } from 'express'
const router = Router()
import Controller from './controller.js'

router.post('/auth', Controller.verifyUser)
router.post('/autht', Controller.verifyToken)

router.get('/new', Controller.getFreeId)
router.post('/upload', Controller.upload)
router.post('/insert', Controller.insertProducts)
router.post('/update', Controller.updateProducts)
router.post('/delete', Controller.deleteProducts)
router.get('/products', Controller.getProducts)
router.get('/products/:id', Controller.getProduct)
router.get('/check', Controller.checkFileUsage)


router.get('/filters', Controller.GetFilters)
// router.post('/flins', FiltersDB.Insert)
// router.post('/flupd', FiltersDB.Update)
// router.post('/fldel', FiltersDB.Delete)

export default router
