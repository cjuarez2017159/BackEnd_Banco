import Cliente from "../cliente/cliente.model.js";
import Admin from "../admin/admin.model.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generate-JWT.js";

export const loginCliente = async (req, res) => {
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
        res.status(500).send("Contact administrator");
    }
};

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username: username.toLowerCase() });

        if(admin && (await bcryptjs.compare(password, admin.password))){
        const token = await generarJWT(admin.id, admin.username);

        res.status(200).json({
            msg: "Login Admin OK!!!",
            userDetails: {
                username: admin.username,
                token: token
            },
        });
    }

        if (!admin) {
            return res
            .status(400)
            .send(`Wrong credentials, ${username} doesn't exists en database`);
        }

        const validPassword = await bcryptjs.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).send("wrong password");
        }

    } catch (e) {
        res.status(500).send("Contact administrator");
    }
};
