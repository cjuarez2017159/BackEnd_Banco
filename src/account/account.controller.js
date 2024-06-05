import { response, request } from "express";
import Account from './account.model.js';
import jwt from "jsonwebtoken"
import Cliente from '../cliente/cliente.model.js'
import Admin from '../admin/admin.model.js'

export const accountGet = async (req, res) => {
    const { limite, desde } = req.query;
    const token = req.header('x-token');

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;

    const admin = await Admin.findById(userId);
    if (admin) {
        const cuentas = await Account.find().limit(parseInt(limite)).skip(parseInt(desde));
        return res.json(cuentas);
    } else {
        const cliente = await Cliente.findById(userId);
        if (!cliente) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const cuentaCliente = await Account.findOne({ accountNumber: cliente.account_number });
       
        return res.json(cuentaCliente);
    }
}

export const getByAccountNumber = async(req, res ) => {
    const { accountNumber } = req.body;
    const token = req.header('x-token');

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;

    const admin = await Admin.findById(userId);

    if (admin) {
        const cuentas = await Account.find({ accountNumber });
        return res.json(cuentas);
    } else {
        const cliente = await Cliente.findById(userId);
        if (!cliente) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const cuentaCliente = await Account.findOne({ accountNumber: cliente.account_number });
        
        if (!cuentaCliente) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        return res.json(cuentaCliente);
    }
}

export const accountPost = async (req, res) => {
    const { account_number, amountAccount, DPI, nameClient } = req.body;
    const token = req.header("x-token");
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;
    const admin = await Admin.findById(userId);


    if (!admin) {
        return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." });
    }

    const nuevaCuenta = new Account({ account_number, amountAccount, DPI, nameClient });
    await nuevaCuenta.save();

    return res.status(201).json({ message: "Cuenta creada exitosamente", cuenta: nuevaCuenta });
}

export const accountPut = async (req, res) => {
    const { _id, estado, accountNumber, ...resto } = req.body;
    const { id } = req.params;
    const token = req.header("x-token");

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;
    const admin = await Admin.findById(userId);
    const cliente = await Cliente.findById(userId);
    const cuentaExistente = await Account.findById(id);

    if (!cuentaExistente) {
        return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    if (admin || (cliente && cuentaExistente.accountNumber === cliente.account_number)) {
        const cuentaActualizada = await Account.findByIdAndUpdate(id, resto, { new: true });
        return res.status(200).json({
            message: "Cuenta actualizada exitosamente",
            cuentaActualizada
        });
    } else {
        return res.status(403).json({ message: "Acceso denegado. No tienes permisos para editar esta cuenta." });
    }

}

export const accountDesactivation = async (req, res) => {
    const {id} = req.params;
    const token = req.header("x-token")

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;
    const isAdmin = await Admin.findById(userId);

    if (isAdmin) {
        const account = await Account.findByIdAndUpdate(id, { state: false });
        return res.status(200).json({
            msg: 'Account Removed',
            account
        });
    } else {
        const accountAuthentic = await Account.findById(id);
        const cliente = await Cliente.findById(userId);

        if (!accountAuthentic) {
            return res.status(404).json({ msg: 'Account not found' });
        }

        if (accountAuthentic.accountNumber.toString() !== cliente.account_number) {
            return res.status(403).json({ msg: 'You are not authorized to delete this Account' });
        }

        const account = await Account.findByIdAndUpdate(id, { estado: false });
        return res.status(200).json({
            msg: 'Account Removed',
            account
        });
    }
}