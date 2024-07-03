import mongoose from "mongoose";

const HistorySchema = mongoose.Schema({
    estado: {
        type: String,
        default: true,
    },
    account: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }],
        _id: false,
    },
    service: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }],
        _id: false,
    },
    product: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        _id: false,
    }
});

export default mongoose.model('History', HistorySchema);
