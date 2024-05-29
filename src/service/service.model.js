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

const service = model("Service", ServiceSchema);

export default service;
