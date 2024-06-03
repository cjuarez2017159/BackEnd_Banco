import mongose from "mongoose"

const ProductSchema = mongose.Schema({
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

const product = model ("Product", ProductSchema);

export default product;