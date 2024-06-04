import jwt from 'jsonwebtoken'
import { response, request } from "express";
import Product from "./product.model.js";
import Admin from "../admin/admin.model.js";

export const productGet = async (req, res) => {
    const { limite, desde} = req.query;

    const product = await Product.find().limit(parseInt(limite)).skip(parseInt(desde));
    
    return res.json({
        product
    });

}

export const productPost = async (req, res) => {

    const {products, description} = req.body

    const token = req.header('x-token');

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const adminId = decoded.uid;

    const admin = await Admin.findById(adminId);

    if (!admin){
        return res.status(401).json({
            msg: 'No es un admin'
        });
    }

    const newProduct = new Product ({ products, description});
    await newProduct.save();

    return res.status(201).json({ message: "Producto creado ", product: newProduct})
}

