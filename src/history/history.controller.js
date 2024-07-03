import { response, request } from "express";
import History from "./history.model.js";

export const HistoryGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const [total, historias] = await Promise.all([
            History.countDocuments(query),
            History.find(query)
                .populate('account')
                .populate('service')
                .populate('product')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            historias
        });
    } catch (error) {
        console.error('Error al obtener historias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const getHistoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const historia = await History.findById(id)
            .populate('account')
            .populate('service')
            .populate('product');

        if (!historia) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        res.status(200).json({
            historia
        });
    } catch (error) {
        console.error('Error al obtener la historia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
