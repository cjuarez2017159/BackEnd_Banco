import Account from "../account/account.model.js";
import Client from "../cliente/cliente.model.js";
import jwt from "jsonwebtoken";
import Transfer from "./transfer.model.js";

export const transferPost = async (req, res) => {
    const { amount, account_number, DPI } = req.body;
    const token = req.header("x-token");
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    } catch (error) {
        return res.status(401).json({ message: "Token no válido" });
    }

    const userId = decoded.uid;

    try {
        const client = await Client.findById(userId);
        if (!client) {
            return res.status(403).json({ message: "Acceso denegado. Se requiere un usuario válido." });
        }

        const senderAccount = await Account.findOne({ accountNumber: client.account_number });
        if (!senderAccount) {
            return res.status(404).json({ message: "La cuenta del remitente no existe o no pertenece al usuario." });
        }

        const amountNumber = Number(amount);
        const senderAmountAccountNumber = Number(senderAccount.amountAccount);

        if (amountNumber > 2000) {
            return res.status(400).json({ message: "No puede transferir más de Q2000 en una sola transferencia." });
        }

        if (amountNumber > senderAmountAccountNumber) {
            return res.status(400).json({ message: "Fondos insuficientes en la cuenta del remitente." });
        }

        const receiverAccount = await Account.findOne({ accountNumber: account_number, DPI: DPI });
        if (!receiverAccount) {
            return res.status(404).json({ message: "La cuenta del destinatario no existe." });
        }

        const transfer = new Transfer({
            amount: amountNumber,
            sender_account_number: senderAccount.accountNumber,
            receiver_account_number: receiverAccount.accountNumber,
            DPI,
            createdAt: new Date()
        });

        await transfer.save();

        const receiverAmountAccountNumber = Number(receiverAccount.amountAccount);
        senderAccount.amountAccount = (senderAmountAccountNumber - amountNumber).toString();
        receiverAccount.amountAccount = (receiverAmountAccountNumber + amountNumber).toString();

        await senderAccount.save();
        await receiverAccount.save();

        return res.status(200).json({ message: "Transferencia realizada exitosamente." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const cancelTransfer = async (req, res) => {
    const { id } = req.params;
    const token = req.header("x-token");
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    } catch (error) {
        return res.status(401).json({ message: "Token no válido" });
    }

    const userId = decoded.uid;

    try {
        const client = await Client.findById(userId);
        if (!client) {
            return res.status(403).json({ message: "Acceso denegado. Se requiere un usuario válido." });
        }

        const transfer = await Transfer.findById(id);
        if (!transfer) {
            return res.status(404).json({ message: "Transferencia no encontrada." });
        }

        if (!transfer.estado) {
            return res.status(400).json({ message: "La transferencia ya ha sido cancelada." });
        }

        const now = new Date();
        const timeElapsed = (now - transfer.createdAt) / (1000 * 60);

        if (timeElapsed > 5) {
            return res.status(400).json({ message: "La transferencia solo puede ser cancelada dentro de los primeros 5 minutos." });
        }

        const senderAccount = await Account.findOne({ accountNumber: transfer.sender_account_number });
        const receiverAccount = await Account.findOne({ accountNumber: transfer.receiver_account_number });

        if (!senderAccount || !receiverAccount) {
            return res.status(404).json({ message: "Cuenta del remitente o destinatario no encontrada." });
        }

        const transferAmount = Number(transfer.amount);
        const senderAmountAccountNumber = Number(senderAccount.amountAccount);
        const receiverAmountAccountNumber = Number(receiverAccount.amountAccount);

        senderAccount.amountAccount = (senderAmountAccountNumber + transferAmount).toString();
        receiverAccount.amountAccount = (receiverAmountAccountNumber - transferAmount).toString();

        transfer.estado = false;

        try {
            await transfer.save();
            await senderAccount.save();
            await receiverAccount.save();
        } catch (error) {
            return res.status(500).json({ message: "Error al cancelar la transferencia y actualizar los saldos." });
        }

        return res.status(200).json({ message: "Transferencia cancelada exitosamente." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};