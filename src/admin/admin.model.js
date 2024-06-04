
import mongoose from "mongoose"

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "The username is requiered"]
    },

    password: {
        type: String,
        required: [true, "The password is required"]
    }
})

export default  mongoose.model('Admin', AdminSchema);

