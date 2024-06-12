import Account from "../account/account.model.js";
import Client from "../cliente/cliente.model.js";
import jwt from "jsonwebtoken";
import Transfer from "./transfer.model.js";

export const transferPost = async (req, res) => {
    const { amount, account_number, DPI } = req.body;
    const token = req.header("x-token");
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;

    const client = await Client.findById(userId);
    if (!client) {
        return res.status(403).json({ message: "Acceso denegado. Se requiere un usuario válido." });
    }

    const senderAccount = await Account.findOne({ accountNumber: client.account_number });
    if (!senderAccount) {
        return res.status(404).json({ message: "La cuenta del remitente no existe o no pertenece al usuario." });
    }

    if (amount > 2000) {
        return res.status(400).json({ message: "No puede transferir más de Q2000 en una sola transferencia." });
    }

    if (amount > senderAccount.amountAccount) {
        return res.status(400).json({ message: "Fondos insuficientes en la cuenta del remitente." });
    }

    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    const startOfDay = new Date(currentDate).toISOString();

    const todaysTransfers = await Transfer.find({
        sender_account_number: senderAccount.accountNumber,
        createdAt: { $gte: startOfDay }
    });

    const totalAmountTransferredToday = todaysTransfers.reduce((total, transfer) => total + transfer.amount, 0);

    if (totalAmountTransferredToday + amount > 10000) {
        return res.status(400).json({ message: "Ha excedido el límite máximo de transferencia permitido por día." });
    }

    const receiverAccount = await Account.findOne({ accountNumber: account_number, DPI: DPI });
    if (!receiverAccount) {
        return res.status(404).json({ message: "La cuenta del destinatario no existe." });
    }

    const transfer = new Transfer({
        amount,
        sender_account_number: senderAccount.accountNumber,
        receiver_account_number: receiverAccount.accountNumber,
        DPI,
        createdAt: new Date() 
    });

    try {
        await transfer.save();
    } catch (error) {
        return res.status(500).json({ message: "Error al guardar el registro de transferencia." });
    }

    senderAccount.amountAccount -= amount;
    receiverAccount.amountAccount += amount;

    try {
        await senderAccount.save();
        await receiverAccount.save();
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar los saldos de las cuentas." });
    }

    return res.status(200).json({ message: "Transferencia realizada exitosamente." });
}

