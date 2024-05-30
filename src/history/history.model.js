import mongoose from "mongoose";
import account from "../account/account.model";

const HistorySchema = mongoose.Schema({

    account: {
        type: [{
            amountAccount: { type: String, require: true},
            account_number: { type: String, require: true},
        
        }],
        _id: false,
    },

    service:{
        type: [{
            service: { type: String, require: true},
    }],
        _id: false,
    },

    product:{
        type: [{
            product: { type: String, require: true},
        }],
        _id: false,
    }

})

export default mongoose.model('History', HistorySchema);