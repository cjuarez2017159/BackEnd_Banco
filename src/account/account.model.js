import mongoose from "mongoose";

const AccountSchema = mongoose.Schema({
    amountAccount: {
        type: String,
        required: true
    },
    account_number: { 
        type: String,
        required: true
    },
    DPI: {
        type: String,
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
