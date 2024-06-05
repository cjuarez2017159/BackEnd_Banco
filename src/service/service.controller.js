import { response, request, json } from "express";
import Admin from "../admin/admin.model.js"
import jwt from "jsonwebtoken"
import Service from "./service.model.js";

export const serviceGet = async (req, res) => {

    const { limite, desde} = req.query;
    const query = {estado:true};

    const [total, servicios] = await Promise.all([

        Service.countDocuments(query),
        Service.find(query)
        .skip(Number(desde))
        .limit(Number(limite))

    ]);

    res.status(200).json({
        
        total,
        servicios
    });

}


export const servicePost = async (req, res) => {

    const { services, description} = req.body;
    const service = new Service ( { services, description } );
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


    await service.save();

    res.status(200).json({
        service
    });

}