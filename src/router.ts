import { Router } from 'express'
import DataWork from './sqlite/index.js'

const router = Router()
const db = await DataWork.openDb();

// POST
router.get('/insert/:id', async (req, res) => {
    try {
        if (db !== false) {
            const p = {
                "id": 3,
                "title": "Аккумуляторная дрель-шуруповёрт BOSCH GSR 12V-35",
                "brand": 102,
                "category": 204,
                "img": "",
                "price": 11990,
                "available": Number(req.params.id)
            };
            await DataWork.insertProduct({ item: p, db });
            res.sendStatus(200);
        }
    }
    catch (e) {
        console.log(e);
    }
})

// POST
router.get('/delete/:id', async (req, res) => {
    try {
        if (db !== false) {
            await DataWork.removeProduct({ id: Number(req.params.id), db })
            res.sendStatus(200);
        }
    }
    catch (e) {
        console.log(e);
    }
})

router.get('/products', async (req, res) => {
    try {
        if (db !== false) {
            const products = await DataWork.getProducts({ db });
            res.json(products);
        }
    }
    catch (e) {
        console.log(e);
    }
})

router.get('/products/:id', async (req, res) => {
    try {
        if (db !== false) {
            const product = await DataWork.getProduct({ id: Number(req.params.id), db });
            if (product) {
                res.json(product);
            }
            else
                res.sendStatus(404);
        }
    }
    catch (e) {
        console.log(e);
    }
})

export default router