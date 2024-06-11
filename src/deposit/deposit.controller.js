import Deposit from "./deposit.model.js";
import Account from "../account/account.model.js";
import jwt  from "jsonwebtoken";
import Client from "../cliente/cliente.model.js"


export const depositPost = async (req, res) => {
    const { amount, account_number, DPI } = req.body;
    const token = req.header("x-token");
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const userId = decoded.uid;

    const client = await Client.findById(userId);
    if (!client) {
        return res.status(403).json({ message: "Acceso denegado. Se requiere un usuario válido." });
    }

    const account = await Account.findOne({ accountNumber: client.account_number  });
    if (!account) {
        return res.status(404).json({ message: "La cuenta no existe o no pertenece al usuario." });
    }

    const deposit = new Deposit({
        amount,
        account_number,
        DPI,
        createdAt: new Date() 
    });

    try {
        await deposit.save();
    } catch (error) {
        return res.status(500).json({ message: "Error al guardar el registro de depósito." });
    }

    account.amountAccount += amount;
    try {
        await account.save();
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el saldo de la cuenta." });
    }

    return res.status(200).json({ message: "Depósito realizado exitosamente." });
}

export const revertDeposits = async (req, res) => {
    const {id} = req.params;

        const deposit = await Deposit.findById(id);

        if (!deposit) {
            return res.status(404).json({ message: "Depósito no encontrado." });
        }

        if (!deposit.estado) {
            return res.status(400).json({ message: "Este depósito ya ha sido revertido." });
        }

        const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
        if (deposit.time < oneMinuteAgo) {
            return res.status(400).json({ message: "Ya ha pasado más de un minuto desde que se realizó este depósito. No se puede revertir." });
        }

        const account = await Account.findOne({ accountNumber: deposit.account_number });
        if (!account) {
            return res.status(404).json({ message: "Cuenta no encontrada para revertir el depósito." });
        }
        account.amountAccount -= deposit.amount;
        await account.save();

        deposit.estado = false;
        await deposit.save();

        return res.status(200).json({ message: "Depósito revertido exitosamente." });
}