'use strict'
import bcryptjs from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js'
import clienteRoutes from '../src/cliente/cliente.routes.js'


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.clientePath = '/bank/v1/cliente'

        this.conectarDB();
        this.middlewares();
        this.routes();
        
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){

        this.app.use(this.clientePath, clienteRoutes);

    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server running and listening to port', this.port)
        })
    }

}

export default Server;