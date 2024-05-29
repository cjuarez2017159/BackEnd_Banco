import Cliente from "../cliente/cliente.model.js";
import Admin from "../admin/admin.model.js";
import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generate-JWT.js";

export const login = async (req, res) => {
    const { account_number, password, username } = req.body;

    try {
        const cliente = await Cliente.findOne({ account_number: account_number.toLowerCase() });

        if (cliente) {
            const validPassword = await bcryptjs.compare(password, cliente.password);
            if (validPassword) {
                const token = await generarJWT(cliente.id, cliente.account_number);
                return res.status(200).json({
                    msg: "Login OK!!!",
                    userDetails: {
                        nameClient: cliente.nameClient,
                        token: token,
                        role: "client"
                    },
                });
            } else {
                return res.status(400).send("Contraseña incorrecta");
            }
        }

        const admin = await Admin.findOne({ username: username.toLowerCase() });

        if (admin) {
            const validPassword = await bcryptjs.compare(password, admin.password);
            if (validPassword) {
                const token = await generarJWT(admin.id, admin.username);
                return res.status(200).json({
                    msg: "Login OK!!!",
                    userDetails: {
                        username: admin.username,
                        token: token,
                        role: "admin"
                    },
                });
            } else {
                return res.status(400).send("Contraseña incorrecta");
            }
        }

        return res.status(400).send(`Credenciales incorrectas, ${account_number, username} no existe en la base de datos`);

    } catch (e) {
        console.log(e);
        res.status(500).send("Comuníquese con el administrador");
    }
};

