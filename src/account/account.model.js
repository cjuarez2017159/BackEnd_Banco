import mongoose from "mongoose"

const AccountSchema = mongoose.Schema({
    amountAccount: {
        type: Number,
        required: true
    },
    accountNumber: {
        type: Number,
        required: true
    },
    DPI: {
        type: Number,
        required: true
    },
    nameClient: {
        type: String,
        required: [true, "The nameClient is required"]
    },
    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Account", AccountSchema);
