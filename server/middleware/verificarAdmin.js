
const verificarAdmin = (req, res, next) => {


    if (req.usuarioLogado && req.usuarioLogado.cargo === 'admin') {
        
        next();
    } else {
        // Se não for admin (ou se req.usuarioLogado não existir por algum motivo),
        // ele não tem permissão.
        res.status(403).json({ mensagem: 'Acesso negado. Requer privilégios de administrador.' });
    
    }
};

module.exports = verificarAdmin;