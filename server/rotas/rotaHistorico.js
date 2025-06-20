const express = require("express");
const router = express.Router();
const Historico_agregado = require('../modelos/Historico_agregado');


router.get('/historico', async (req, res) => {
    try {
        // Pegamos os parâmetros da URL (query parameters)
        const { localidade, ano } = req.query;

        if (!localidade || !ano) {
            return res.status(400).json({ mensagem: "Os parâmetros 'localidade' e 'ano' são obrigatórios." });
        }

        // Chama o método do nosso modelo para buscar os dados no banco
        const dados = await Historico_agregado.buscarPorLocalidadeEAno(localidade, parseInt(ano, 10));
        

        // Se nenhum dado for encontrado, retorna um array vazio (o que é ok)
        res.json(dados);

    } catch (error) {
        console.error("Erro na rota /historico:", error);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

router.get('/historico-anual', async (req, res) => {
    try {
        const { localidade } = req.query; // Pega a localidade da URL

        if (!localidade) {
            return res.status(400).json({ mensagem: "O parâmetro 'localidade' é obrigatório." });
        }

        // Chama o método do modelo que já criamos, passando a localidade dinamicamente
        const dados = await Historico_agregado.buscarTotalAnualPorLocalidade(localidade.toUpperCase());
        res.json(dados);

    } catch (error) {
        console.error("Erro na rota /historico-anual:", error);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

module.exports = router;