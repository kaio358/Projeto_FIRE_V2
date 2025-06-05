
import { useState } from "react";
import styles from "./Login.module.css";
import { Link } from 'react-router-dom';

import { useAuth } from '../funcionalidades/AuthContext';


function Login() {
    const apiUrl = process.env.REACT_APP_API_URL ;
    // entradas de valores
    const [nome,setNome] = useState('')
    const [senha,setSenha]= useState('')
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Para Autenticação
    const { loginAuth } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        setError('');
        setSuccessMessage('');

        try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, senha }),
        });

        const data = await response.json();
        

        if (!response.ok) {
            throw new Error(data.mensagem || 'Erro ao fazer login.');
        }
        if (data.token && data.usuario) {
            loginAuth(data.token, data.usuario); // Passa o token e os dados do usuário
            setSuccessMessage(data.mensagem || 'Login realizado com sucesso!');
            // Opcional: redirecionar para o dashboard ou página inicial
            // history.push('/dashboard'); // Se estiver usando React Router com useHistory
        } else {
            throw new Error('Resposta da API de login não contém token ou dados do usuário.');
        }
    
        
        
        // Limpar campos ou redirecionar
        setNome('');
        setSenha('');

        } catch (err) {
        setError(err.message);
        }
        };

    return (
        <div className={styles.fundoLogin}>
            {/* {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} */}
            <form className={styles.formLogin} onSubmit={handleSubmit} >
                <h2>Bem-vindo ao FIRE</h2> 
                <div className={styles.inputGroup}  >
                    {/* <label htmlFor="nomeUsuario">Usuário/Email:</label>*/}
                    <input 
                        type="text" 
                        id="nomeUsuario" 
                        name='nome'
                        placeholder="Nome de usuário" 
                        className={styles.inputLogin}
                        value={nome}
                        onChange={(e)=>setNome(e.target.value)}
                    />
                </div>
                
                <div className={styles.inputGroup}>
                    {/* <label htmlFor="senha">Senha:</label> */}
                    <input 
                        type="password" 
                        id="senha" 
                        name='senha'
                        placeholder="Senha" 
                        className={styles.inputLogin}
                        value={senha}
                        onChange={(e)=>setSenha(e.target.value)}
                    />
                </div>
                
                <button className={styles.entrar} type="submit">Entrar</button>

                <div className={styles.linkAuxiliar}>
                    <p><Link to="/esqueceu-senha">Esqueceu a senha?</Link></p>
                    {/* <p>Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p> */}
                </div>
            </form>
        </div>
    )
}

export default Login;