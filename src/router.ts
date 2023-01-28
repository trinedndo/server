import { Router } from 'express'
import { IProduct } from './models/IProduct.js'
import DataWork from './sqlite.js'

const router = Router()

router.post('/insert', async (req, res) => {
    try {
        const item: IProduct = req.body
        await DataWork.insertProduct(item);
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
    }
})

router.post('/update', async (req, res) => {
    try {
        const items: IProduct[] = req.body
        await DataWork.updateProducts(items);
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
    }
})

router.post('/delete', async (req, res) => {
    try {
        const items: number[] = req.body
        // console.log(items[0]);
        await DataWork.removeProducts(items)
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
    }
})

router.get('/products', async (req, res) => {
    try {
        const products = await DataWork.getProducts();
        res.json(products);
    }
    catch (e) {
        console.log(e);
    }
})

router.get('/products/:id', async (req, res) => {
    try {
        const product = await DataWork.getProduct(Number(req.params.id));
        if (product) {
            res.json(product);
        }
        else
            res.sendStatus(404);
    }
    catch (e) {
        console.log(e);
    }
})

export default router