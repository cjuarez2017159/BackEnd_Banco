import mongose from "mongoose"

const ServiceSchema = mongose.Schema({
    services: {
       type: String,
       required: true
    },
    description: {
        type: String,
        required: true
    }
});

export default mongose.model('Service', ServiceSchema);