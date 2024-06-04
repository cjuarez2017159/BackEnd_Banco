import mongoose from "mongoose"

const ProductSchema = mongoose.Schema({
    products: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required:true
    }
});

export default mongoose.model("Product", ProductSchema);