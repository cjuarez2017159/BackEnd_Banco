import mongose from "mongoose"
import account from "../account/account.model";

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

export default account;
