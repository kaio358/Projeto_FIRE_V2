import  { useState } from 'react';
import Menu from '../layout/Menu';
import { useAuth } from '../funcionalidades/AuthContext';
import styles from './AdminPage.module.css'; 


function AdminPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [tipoDeDado, setTipoDeDado] = useState('historico_brasil');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const { token } = useAuth();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
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
            setSelectedFile(null);

        } catch (error) {
            setFeedback({ message: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.adminContainer}>
         
            <div className={styles.uploadCard}>
                <h1>Painel de Administração</h1>
                <p className={styles.subtitle}>Upload de Dados de Queimadas (.csv)</p>

                {/* ### AQUI ESTÁ A MUDANÇA ### */}
                {/* Renderiza um <p> condicional para feedback, com classes de estilo dinâmicas */}
                {feedback.message && (
                    <p className={`${styles.feedbackMessage} ${styles[feedback.type]}`}>
                        {feedback.message}
                    </p>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="dataTypeSelect">1. Selecione o tipo de dado:</label>
                    <select
                        id="dataTypeSelect"
                        className={styles.selectInput}
                        value={tipoDeDado}
                        onChange={(e) => setTipoDeDado(e.target.value)}
                    >
                        <option value="historico_brasil">Histórico - Brasil (Geral)</option>
                        <option value="historico_sp">Histórico - São Paulo (SP)</option>
                        <option value="historico_rj">Histórico - Rio de Janeiro (RJ)</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="fileInput">2. Escolha o arquivo CSV:</label>
                    <label htmlFor="fileInput" className={styles.fileInputLabel}>
                        {selectedFile ? selectedFile.name : 'Procurar arquivo...'}
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".csv"
                        className={styles.fileInput}
                        onChange={handleFileChange}
                    />
                </div>

                <button onClick={handleUpload} className={styles.uploadButton} disabled={isLoading || !selectedFile}>
                    {isLoading ? 'Enviando e Processando...' : 'Enviar Arquivo'}
                </button>
            </div>
        </div>
    );
}

export default AdminPage;