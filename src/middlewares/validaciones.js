import Cliente from "../cliente/cliente.model.js";
import Account from "../account/account.model.js";
import Transfer from "../transfer/transfer.model.js";
import Deposit from "../deposit/deposit.model.js";

export const validarDPIExistente = async (req, res, next) => {
    const { DPI } = req.body;

    if (!DPI) {
        return res.status(400).json({ message: 'El DPI es requerido' });
    }

    try {
        const cliente = await Cliente.findOne({ DPI });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente con este DPI no encontrado' });
        }

        req.cliente = cliente;

        next();
    } catch (error) {

        console.error('Error al buscar cliente por DPI:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const validarAccountNumberExistente = async (req, res, next) => {
    const { accountNumber } = req.body;

    if (!accountNumber) {
        return res.status(400).json({ message: 'El número de cuenta es requerido' });
    }

    try {
        const account = await Account.findOne({ accountNumber });
        if (!account) {
            return res.status(404).json({ message: 'Cuenta con este número no encontrada' });
        }

        req.account = account;

        next();
    } catch (error) {

        console.error('Error al buscar cuenta por número de cuenta:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const validarNameClientExistente = async (req, res, next) => {
    const { nameClient } = req.body;

    if (!nameClient) {
        return res.status(400).json({ message: 'El nombre del cliente es requerido' });
    }

    try {
        const account = await Account.findOne({ nameClient });
        if (!account) {
            return res.status(404).json({ message: 'Cliente con este nombre no encontrado en la cuenta' });
        }

        req.account = account;

        next();
    } catch (error) {
        console.error('Error al buscar cuenta por nombre de cliente:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};



export const validarLimiteDiarioTransferencia = async (req, res, next) => {
    const token = req.header("x-token");
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;

    const client = await Client.findById(userId);
    if (!client) {
        return res.status(403).json({ message: "Acceso denegado. Se requiere un usuario válido." });
    }

    const { amount } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const transfersToday = await Transfer.find({
        sender_account_number: client.account_number,
        createdAt: { $gte: today }
    });

    const totalTransferredToday = transfersToday.reduce((total, transfer) => total + transfer.amount, 0);

    if ((totalTransferredToday + amount) > 10000) {
        return res.status(400).json({ message: "Límite diario de transferencias de 10,000 Quetzales excedido." });
    }

    next();
};

export const validarLimiteDiarioDeposito = async (req, res, next) => {
    const token = req.header("x-token");
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;

    const client = await Client.findById(userId);
    if (!client) {
        return res.status(403).json({ message: "Acceso denegado. Se requiere un usuario válido." });
    }

    const { amount } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const depositsToday = await Deposit.find({
        account_number: client.account_number,
        createdAt: { $gte: today }
    });

    const totalDepositedToday = depositsToday.reduce((total, deposit) => total + deposit.amount, 0);

    if ((totalDepositedToday + amount) > 10000) {
        return res.status(400).json({ message: "Límite diario de depósitos de 10,000 Quetzales excedido." });
    }

    next();
};