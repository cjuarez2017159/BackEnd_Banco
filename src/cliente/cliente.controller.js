import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Cliente from "./cliente.model.js";

export const clienteGet = async (req, res) => {

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
    
    const salt = bcryptjs.genSaltSync(10);
    cliente.password = bcryptjs.hashSync(password, salt);

    await cliente.save();

    res.status(200).json({
        cliente
    });

}

export const getClienteById = async (req,res) => {

    const {id} = req.params;
    const cliente = await Cliente.findOne({_id: id});

    res.status(200).json({
        cliente
    })

}


export const clientesPut = async (req, res = response) => {

    const { id } = req.params;
    const {_id, nameClient, address, cellphone, email, job, monthlyIncome, ...resto} = req.body

    if(password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    await Cliente.findByAndUpdate(id, resto);

    const cliente = await Cliente.findOne({_id: id});

    res.status(200).json({
        msg: 'Cliente Actualizado',
        cliente
    })

}