import mongose from "mongoose"

const AccountSchema = mongose.Schema({
    amountAccount: {
        type: decimal,
        required: true
    },
    accountNumber: {
        type: integer,
        required: true
    },
    DPI: {
        type: integer,
        required: true
    },
    nameClient: {
        type: string,
        required: [true, "The nameClient is required"]
    }
});

const account = model("Account", AccountSchema);

export default account;