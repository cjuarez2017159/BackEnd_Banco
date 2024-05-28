import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Cliente from './cliente.model.js'

export const ClienteGet = async (req, res) => {

    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, clientes] = await Promise.all([

        Cliente.countDocuments(query),
        Cliente.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({

        total,
        clientes

    });

}

export const clientePost = async (req, res) => {

    const { nameClient, DPI, address, cellphone, email, password, job, monthlyIncome} = req.body;
    const cliente = new Cliente ( { nameClient, DPI, address, cellphone, email, password, job, monthlyIncome} );

    const salt = bcryptjs.genSalt
    cliente.password = bcryptjs.hashSync(password, salt);

    await cliente.save();

    res.status(200).json({
        cliente
    });

}