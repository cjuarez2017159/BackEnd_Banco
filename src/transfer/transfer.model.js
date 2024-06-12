import mongoose from "mongoose";

const TransferSchema = new mongoose.Schema({
    amount: {
        type: Number,
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
    }
});

export default mongoose.model('Transfer', TransferSchema)