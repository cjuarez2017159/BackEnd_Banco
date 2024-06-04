import jwt from 'jsonwebtoken';
import Admin from '../admin/admin.model.js';

export const validarJWT = async (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-token'];

    if (!token) {
        return res.status(401).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        /*const clienteId = decoded.uid;

        const admin = await Admin.findById(clienteId);

        if (!admin) {
            return res.status(401).json({
                msg: 'Tú no eres administrador'
            });
        }

        if (!admin.estado) {
            return res.status(401).json({
                msg: 'Token no válido - administrador en estado false'
            });
        }
*/
        req.user = decoded;
    } catch (e) {
        console.log(e);
        return res.status(401).send('Invalid Token');
    }

    return next();
};
