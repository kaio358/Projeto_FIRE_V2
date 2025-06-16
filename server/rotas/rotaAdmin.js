const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Serviços e Middlewares
const SincronizacaoService = require('../infraestrutura/SincronizacaoService');
const verificarToken = require('../infraestrutura/verificacaoJWT');
const verificarAdmin = require('../middlewares/verificarAdmin');

// Configura o Multer para salvar os arquivos enviados em uma pasta 'uploads'
const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });

// Define a rota para upload de CSV
// A requisição passará pelos middlewares em ordem:
// 1. verificarToken: Checa se há um token JWT válido.
// 2. verificarAdmin: Checa se o usuário do token tem o cargo 'admin'.
// 3. upload.single: Processa o upload do arquivo.
router.post('/upload-csv', [verificarToken, verificarAdmin], upload.single('arquivo_csv'), async (req, res) => {
    // 'arquivo_csv' é o nome do campo que o frontend envia no FormData
    
    const tipoDeDado = req.body.tipoDeDado;
    const arquivo = req.file;

    if (!arquivo) {
        return res.status(400).json({ mensagem: 'Nenhum arquivo foi enviado.' });
    }
    if (!tipoDeDado) {
        // Se o tipo de dado não for enviado, deletamos o arquivo que já foi salvo
        fs.unlinkSync(arquivo.path);
        return res.status(400).json({ mensagem: 'O tipo de dado para o arquivo não foi especificado.' });
    }

    try {
        console.log(`Recebido arquivo '${arquivo.originalname}' para o tipo '${tipoDeDado}'.`);
        
        // Chama o serviço para processar o arquivo. O serviço agora é flexível.
        const resultado = await SincronizacaoService.processarHistoricoAgregado(arquivo.path, tipoDeDado);

        res.json({
            mensagem: `Arquivo '${arquivo.originalname}' processado com sucesso!`,
            dados: resultado
        });

    } catch (error) {
        console.error("Erro ao processar o arquivo CSV na rota:", error);
        res.status(500).json({ mensagem: 'Falha ao processar o arquivo.', erro: error.message });
    } finally {
        // O bloco 'finally' garante que o arquivo temporário seja deletado
        // independentemente de ter ocorrido um erro ou não.
        if (arquivo && fs.existsSync(arquivo.path)) {
            fs.unlinkSync(arquivo.path);
            console.log(`Arquivo temporário deletado: ${arquivo.path}`);
        }
    }
});

module.exports = router;