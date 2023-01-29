import { IProduct } from "../models/IProduct.js";

export const Verify = (item: IProduct) => {
    const { ID, TITLE, BRAND, TYPE, IMG, PRICE, INSTOCK } = item;
    if (ID === undefined) {
        return false;
    }
    else if (TITLE === undefined) {
        return false;
    }
    else if (BRAND === undefined) {
        return false;
    }
    else if (TYPE === undefined) {
        return false;
    }
    else if (PRICE === undefined) {
        return false;
    }
    else if (INSTOCK === undefined) {
        return false;
    }
    return true;
}