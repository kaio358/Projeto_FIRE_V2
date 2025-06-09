import { useState } from 'react';
import styles from "./Login.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../funcionalidades/AuthContext';
import Feedback from '../funcionalidades/Feedback';

function Login() {
    const urlAPI = process.env.REACT_APP_API_URL;

    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [carregando, setCarregando] = useState(false);

    const fecharMensagem = () => {
        setMensagem({ texto: '', tipo: '' });
    };

    const { loginAuth } = useAuth();
    const navegar = useNavigate();

    const enviarFormulario = async (evento) => {
        evento.preventDefault();
        setCarregando(true);
        fecharMensagem();

        if (!nome || !senha) {
            setMensagem({ texto: 'Preencha todos os campos.', tipo: 'error' });
            setCarregando(false);
            return;
        }

        try {
            const resposta = await fetch(`${urlAPI}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || 'Erro ao fazer login.');
            }

            if (dados.token && dados.usuario) {
                loginAuth(dados.token, dados.usuario);
            } else {
                throw new Error('Resposta da API incompleta.');
            }

            setMensagem({ texto: 'Login realizado com sucesso! Redirecionando...', tipo: 'success' });

            setNome('');
            setSenha('');
            navegar('/');
        } catch (erro) {
            setMensagem({ texto: erro.message, tipo: 'error' });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <Feedback 
                mensagem={mensagem.texto}
                tipo={mensagem.tipo}
                aoFechar={fecharMensagem}
            />

            <div className={styles.fundoLogin}>
                <form className={styles.formLogin} onSubmit={enviarFormulario}>
                    <h2>Bem-vindo ao FIRE</h2>

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            id="nomeUsuario"
                            name="nome"
                            placeholder="Nome de usuário"
                            className={styles.inputLogin}
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            placeholder="Senha"
                            className={styles.inputLogin}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <button className={styles.entrar} type="submit" disabled={carregando}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className={styles.linkAuxiliar}>
                        <p><Link to="/esqueceu-senha">Esqueceu a senha?</Link></p>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;
