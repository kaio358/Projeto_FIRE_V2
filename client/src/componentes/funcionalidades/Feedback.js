

import { useEffect } from 'react';
import styles from './Feedback.module.css';


function Feedback({mensagem,tipo,  aoFechar }) {

    // useEffect para fechar a mensagem automaticamente após 5 segundos
    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => {
                aoFechar(); 
            }, 5000); // 5000ms = 5 segundos

            // Função de limpeza: será executada se o componente for desmontado antes do tempo
            return () => {
                clearTimeout(timer);
            };
        }
    }, [mensagem, aoFechar]);

    // Se não houver mensagem, não renderiza nada
    if (!mensagem) {
        return null;
    }

    // Define a classe CSS com base no tipo da mensagem
    const containerClasses = `${styles.feedbackContainer} ${styles[tipo]}`;

    return (
        <div className={containerClasses}>
            <span>{mensagem}</span>
            <button onClick={aoFechar} className={styles.closeButton}>
                &times; {/* Este é um caractere 'X' para fechar */}
            </button>
        </div>
    );
}

export default Feedback;