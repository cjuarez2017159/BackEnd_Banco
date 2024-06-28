import mongoose from "mongoose";

const TransferSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: true
    },
    sender_account_number: {
        type: String,
        required: true
    },
    receiver_account_number: {
        type: String,
        required: true
    },
    DPI: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Transfer', TransferSchema)