import Cliente from "../cliente/cliente.model.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generate-JWT.js";

export const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const cliente = await Cliente.findOne({ email: email.toLowerCase()});

        if(cliente && (await bcryptjs.compare(password, cliente.password))){
            const token = await generarJWT(cliente.id, cliente.email)

            res.status(200).json({
                msg: "Login!!!",
                clienteDetails: {
                    nameClient: cliente.nameClient,
                    token: token
                },
            });
        }

        if(!cliente) {
            return res
            .status(400)
            .send(`Wrong credentials, ${email} doesn't exists en database`);
        }

        const validPassword = bcryptjs.compareSync(password, cliente.password);
        if(!validPassword){
            return res.status(400).send("wrong password");
        }
    }catch (e) {
        res.status(500).send("Comuniquese con el administrador");
    }
};
