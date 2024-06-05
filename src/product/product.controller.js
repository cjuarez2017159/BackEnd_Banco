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

export const productGetById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }
        
        return res.status(200).json({
            product
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


export const productsPut = async (req, res = response) => {
    const { id } = req.params;
    const { __id, estado, ...resto } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, resto, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }

        return res.status(200).json({
            msg: 'Producto actualizado',
            product: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

export const productDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }

        return res.status(200).json({
            msg: 'Producto Eliminado',
            product: deletedProduct
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};
