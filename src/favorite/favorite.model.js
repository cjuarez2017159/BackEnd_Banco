import mongoose from "mongoose";

const FavoriteSchema = mongoose.Schema({

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