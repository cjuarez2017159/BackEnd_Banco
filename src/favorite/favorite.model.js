import mongoose from "mongoose";

const FavoriteSchema = mongoose.Schema({

    accountOwner: {
        type: String,
        required: true
    },
    account_number: {
        type: String,
        required: true
    },
    alias:{
        type: String,
        required: true
    },
    DPI:{
        type: String,
        required: true
    },
    estado: {
        type: String,
        default: true
    }
});

export default mongoose.model('Favorite', FavoriteSchema);