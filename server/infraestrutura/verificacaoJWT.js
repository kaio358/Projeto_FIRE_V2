
const { jwtVerify } = require('jose');

const { JWT_SECRET_KEY, JWT_ALGORITHM } = require('../config/jwtConfig');  



const verificarToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não encontrado após "Bearer ".' });
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET_KEY, {
            algorithms: [JWT_ALGORITHM], 
        });

       
        req.usuarioLogado = payload; 
        next(); 
    } catch (error) {
        console.error("Erro na verificação do token:", error.code, error.message);
        if (error.code === 'ERR_JWT_EXPIRED') {
            return res.status(401).json({ mensagem: 'Token expirado.' });
        }
        if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || error.code === 'ERR_JWS_INVALID') {
            return res.status(401).json({ mensagem: 'Token inválido.' });
        }
        return res.status(401).json({ mensagem: 'Falha na autenticação do token.' });
    }
};

module.exports = verificarToken;