

import React, { useState } from 'react';
import { useAuth } from '../funcionalidades/AuthContext';

function AdminPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [tipoDeDado, setTipoDeDado] = useState('historico_brasil');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const { token } = useAuth();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setFeedback({ message: 'Por favor, selecione um arquivo.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setFeedback({ message: '', type: '' });

        const formData = new FormData();
        formData.append('arquivo_csv', selectedFile);
        formData.append('tipoDeDado', tipoDeDado); 

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/upload-csv`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.mensagem || 'Falha no upload.');

            setFeedback({ 
                message: `${data.mensagem} | Lidos: ${data.dados.lidos}, Linhas Afetadas: ${data.dados.linhasAfetadas}`, 
                type: 'success' 
            });

        } catch (error) {
            setFeedback({ message: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Painel de Administração</h1>
            <h2>Upload de Dados (.csv)</h2>
            
            {feedback.message && <p style={{ color: feedback.type === 'error' ? 'red' : 'green' }}>{feedback.message}</p>}

            <div>
                <label htmlFor="dataTypeSelect">Selecione o tipo de dado:</label>
                <select 
                    id="dataTypeSelect" 
                    value={tipoDeDado} 
                    onChange={(e) => setTipoDeDado(e.target.value)}
                >
                    <option value="historico_brasil">Histórico - Brasil (Geral)</option>
                    <option value="historico_sp">Histórico - São Paulo (SP)</option>
                    <option value="historico_rj">Histórico - Rio de Janeiro (RJ)</option>
                  
                </select>
            </div>

            <div>
                <label htmlFor="fileInput">Selecione o arquivo CSV:</label>
                <input id="fileInput" type="file" accept=".csv" onChange={handleFileChange} />
            </div>

            <button onClick={handleUpload} disabled={isLoading || !selectedFile}>
                {isLoading ? 'Enviando e Processando...' : 'Enviar Arquivo'}
            </button>
        </div>
    );
}

export default AdminPage;