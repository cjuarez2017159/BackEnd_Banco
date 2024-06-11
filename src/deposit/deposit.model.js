import mongoose from "mongoose";

const DepositSchema = mongoose.Schema({

    amount: {
        type: String,
        required: [true, "Amount es obligatorio"]
    },

    account_number: {
        type: String,
        required: [true, "El número de cuenta del cliente es obligatorio"],
    },
    
    DPI: {
        type: String,
        required: [true, "el DPI es obligatorio"]
    },  

    time: {
        type: Date,
        default: Date.now
    },

    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Deposit', DepositSchema);
