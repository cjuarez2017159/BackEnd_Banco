import Favorite from "./favorite.model.js";
import { response } from "express";
import jwt from "jsonwebtoken";

export const favoriteGet = async (req, res = response) => {
    try {
        const favorites = await Favorite.find();
        return res.status(200).json({ favorites });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const favoritePost = async (req, res = response) => {
    const { account_number, alias, DPI } = req.body;

    try {
        const newFavorite = new Favorite({ account_number, alias, DPI });
        await newFavorite.save();
        return res.status(201).json({ message: "Favorito creado", favorite: newFavorite });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const favoriteGetById = async (req, res = response) => {
    const { id } = req.params;

    try {
        const favorite = await Favorite.findById(id);
        if (!favorite) {
            return res.status(404).json({ msg: "Favorito no encontrado" });
        }
        return res.status(200).json({ favorite });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const favoritePut = async (req, res = response) => {
    const { id } = req.params;
    const { __id, estado, ...resto } = req.body;

    try {
        const updatedFavorite = await Favorite.findByIdAndUpdate(id, resto, { new: true });

        if(!updatedFavorite) {
            return res.status(404).json({
                msg: 'favorito no encontrado'
            });
        }

        return res.status(200).json({
            msg: 'Favorito actualizado',
            favorite: updatedFavorite
        });
    }catch (error){
        return res.status(500).json({
            error: error.message
        });
    }
}

export const favoriteDelete = async (req, res = response) => {
    const { id } = req.params;
    const token = req.header("x-token")

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;
    const isAdmin = await adminModel.findById(use)

    try {
        const updatedFavorite = await Favorite.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!updatedFavorite) {
            return res.status(404).json({ msg: "Favorito no encontrado" });
        }

        return res.status(200).json({ msg: "Estado del favorito eliminado", favorite: updatedFavorite });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};