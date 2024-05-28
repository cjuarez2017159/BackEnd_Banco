import mongoose from "mongoose";

const ClienteSchema = mongoose.Schema({

    cliente: {
        type: String,
        required: [true, "El Cliente es Obligatorio"]
    },

    nameClient: {
        type: String,
        required: [true, "El nameClient del cliente es obligatorio"]
    },

    account_number: {
        type: String,
        required: [true, "El número de cuenta del cliente es obligatorio"],
        default: () => Math.random().toString(36).substring(2, 12) // Genera un número aleatorio de 10 caracteres
    },
    
    DPI: {
        type: String,
        required: [true, "el DPI es obligatorio"]
    },    

    address: {
        type: String,
        required: [true, "el address es obligatorio"]  
    },

    cellphone: {
        type: String,
        required: [true, "el cellphone es obligatorio"]
    },

    email: {
        type: String,
        required: [true, "el email es obligatorio"]
    },

    password: {
        type: String,
        required: [true, "el password es obligatoria"]
    },

    job: {
        type: String,
        required: [true, "el job es obligatoria"]
    },

    monthlyIncome:{
        type: String,
        required: [true, "el monthlyIncome es obligatoria"]
    },

    estado:{
        type: String,
        required: true
    }

});

export default mongoose.model('Cliente', ClienteSchema);


ClienteSchema.methods.toJSON = function(){
    const {__v, _id, ...clientes} = this.ObjectId()
    clientes.uid = _id;
    return clientes
}

