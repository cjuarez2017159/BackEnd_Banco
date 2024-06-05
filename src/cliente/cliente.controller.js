import { response, request, json } from "express";
import bcryptjs from 'bcryptjs';
import Cliente from "./cliente.model.js";
import Admin from "../admin/admin.model.js"
import jwt from "jsonwebtoken"

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
    const token = req.header('x-token');

    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const clienteId = decoded.uid;

    const admin = await Admin.findById(clienteId);

    if(!admin) {
        return res.status(401).json({
            msg: 'TU no eres administrador'
        });
    }

    if(!admin.estado) {
        return res.status(401).json({
            msg:'token no valido - administrador en estado false'
        })
    }
 
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
    const {_id, password,account_number,DPI,estado, ...resto} = req.body

    await Cliente.findByIdAndUpdate(id, resto);

    const cliente = await Cliente.findOne({_id: id});

    res.status(200).json({
        msg: 'Cliente Actualizado',
        cliente
    })

}