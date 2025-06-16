
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const SincronizacaoService = require('../infraestrutura/SincronizacaoService');
const verificarToken = require('../infraestrutura/verificacaoJWT'); 
const verificarAdmin = require('../middleware/verificarAdmin');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-csv', [verificarToken,verificarAdmin], upload.single('arquivo_csv'), async (req, res) => {
    const tipoDeDado = req.body.tipoDeDado; 
    const arquivo = req.file;

    if (!arquivo || !tipoDeDado) {
        return res.status(400).json({ mensagem: 'Nenhum arquivo ou tipo de dado foi especificado.' });
    }

    try {
        let resultado;
        let nomeDaTabela;

        
        if (tipoDeDado.startsWith('historico_')) {
            if (tipoDeDado === 'historico_brasil') {
                nomeDaTabela = 'historicopaisbrasil';
            } else {
           
                const sigla = tipoDeDado.split('_')[1].toUpperCase();
               
                nomeDaTabela = `historicoEstado${sigla}`; 
            }
            
            resultado = await SincronizacaoService.processarHistoricoAgregado(arquivo.path, nomeDaTabela);
        }
      
        else {
            throw new Error('Tipo de dado para upload desconhecido.');
        }

        res.json({
            mensagem: `Arquivo para '${tipoDeDado}' processado com sucesso!`,
            dados: resultado
        });

    } catch (error) {
        console.error("Erro ao processar o arquivo CSV:", error);
        res.status(500).json({ mensagem: 'Falha ao processar o arquivo.', erro: error.message });
    } finally {
        // Deleta o arquivo temporário após o processamento, seja com sucesso ou erro
        fs.unlinkSync(arquivo.path);
    }
});

module.exports = router;