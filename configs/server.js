'use strict'
import bcryptjs from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js'
import Admin from '../src/admin/admin.model.js'



class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

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