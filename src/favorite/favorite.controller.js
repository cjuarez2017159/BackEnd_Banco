import Favorite from "./favorite.model.js";
import { response } from "express";
import jwt from "jsonwebtoken";
import Cliente from "../cliente/cliente.model.js"

export const favoriteGet = async (req, res = response) => {
    const token = req.header("x-token");
    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const clienteId = decoded.uid;

        const account_owner = await Cliente.findById(clienteId);

        const favorites = await Favorite.find({ accountOwner: account_owner.account_number, estado: true });
        
        console.log("Favoritos:", favorites); 
        
        return res.status(200).json({ favorites });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const favoritePost = async (req, res = response) => {
    const { account_number, alias, DPI } = req.body;
    const token = req.header("x-token")

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;

    try {
        const account_owner = await Cliente.findById(userId);

        const newFavorite = new Favorite({ accountOwner: account_owner.account_number, account_number, alias, DPI });
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
    const { __id, estado, accountOwner, ...resto } = req.body;
    const token = req.header("x-token")

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;



    try {
     
        const favorite = await Favorite.findById(id);
        if (!favorite) {
            return res.status(404).json({ msg: "Favorito no encontrado" });
        }

        const cliente = await Cliente.findById(userId);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }
        if (favorite.accountOwner !== cliente.account_number) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar este favorito" });
        }

        const updatedFavorite = await Favorite.findByIdAndUpdate(id, resto, { new: true });

        if (!updatedFavorite) {
            return res.status(404).json({ msg: "Favorito no encontrado" });
        }

        return res.status(200).json({ msg: "Favorito actualizado", favorite: updatedFavorite });
    }catch (error){
        return res.status(500).json({
            error: error.message
        });
    }
}

export const favoriteDelete = async (req, res) => {
    const { id } = req.params;
    const token = req.header("x-token");

    try {
        // Verificar la validez del token
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const userId = decoded.uid;

        // Verificar si el favorito pertenece al usuario
        const favorite = await Favorite.findById(id);
        if (!favorite) {
            return res.status(404).json({ msg: "Favorito no encontrado" });
        }

        // Verificar si el usuario es el propietario del favorito
        const cliente = await Cliente.findById(userId);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }
        if (favorite.accountOwner !== cliente.account_number) {
            return res.status(403).json({ msg: "No tienes permiso para eliminar este favorito" });
        }

        // Actualizar el estado del favorito a false
        favorite.estado = false;
        await favorite.save();

        return res.status(200).json({ msg: "Favorito marcado como no favorito", favorite });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};