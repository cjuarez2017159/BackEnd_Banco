import mongoose from "mongoose";

const DepositSchema = mongoose.Schema({

    amount: {
        type: String,
        required: [true, "Amount is required"]
    },

    account_number: {
        type: String,
        required: [true, "the num of the account is requiered"],
    },
    
    DPI: {
        type: String,
        required: [true, "the DPI is required"]
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
