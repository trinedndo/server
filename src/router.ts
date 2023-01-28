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

router.get('/delete/:id', async (req, res) => {
    try {
        await DataWork.removeProduct(Number(req.params.id))
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