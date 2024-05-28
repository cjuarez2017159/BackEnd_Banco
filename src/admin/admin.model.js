
import mongoose from "mongoose"

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "The username is requiered"]
    },

    password: {
        type: String,
        required: [true, "The password is required"]
    }
})

const Admin = mongoose.model('Admin', AdminSchema)

Admin.findOne({}, async (err, admin) => {
    if (!admin) {
        try {
            const defaultAdmin = new Admin({
                username: 'ADMINB',
                password: 'ADMINB' 
            });

            await defaultAdmin.save();

            console.log('Administrador predeterminado creado');

        } catch (error) {
            
            console.error('Error al crear el administrador predeterminado: ', error);
        }
    }
});

export default Admin;