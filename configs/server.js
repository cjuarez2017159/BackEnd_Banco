'use strict'
import bcryptjs from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { dbConnection } from './mongo.js'
import Admin from '../src/admin/admin.model.js';
import clienteRoutes from '../src/cliente/cliente.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import serviceRoutes from '../src/service/service.routes.js';
import productRoutes from '../src/product/product.routes.js';
import accountRoutes from '../src/account/account.routes.js';
import historyRoutes from  '../src/history/history.routes.js';

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.clientePath = '/bank/v1/cliente'
        this.authPath = '/bank/v1/auth';
        this.servicePath = '/bank/v1/service';
        this.productPath = '/bank/v1/product';
        this.accountPath = '/bank/v1/account'
        this.historyPath = '/bank/v1/history'

        this.conectarDB();
        this.middlewares();
        this.routes();
        this.createDefaultAdmin();
        
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
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.servicePath, serviceRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.accountPath, accountRoutes);
        this.app.use(this.historyPath, historyRoutes)

    }

    async createDefaultAdmin() {
        try {
            const admin = await Admin.findOne({});
            if (!admin) {
                const hashedPassword = await bcryptjs.hash('ADMINB', 10);
                await Admin.create({
                    username: 'ADMINB',
                    password: hashedPassword
                });
                console.log('Administrador predeterminado creado');
            }
        } catch (error) {
            console.error('Error al crear el administrador predeterminado:', error);
        }
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server running and listening to port', this.port)
        })
    }

}

export default Server;