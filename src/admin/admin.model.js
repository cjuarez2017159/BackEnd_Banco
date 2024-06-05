
import mongoose from "mongoose"

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "The username is requiered"]
    },

    password: {
        type: String,
        required: [true, "The password is required"]
    },
    
    estado:{
        type: Boolean,
        default: true
    }
    
})


export default mongoose.model('Admin', AdminSchema)
