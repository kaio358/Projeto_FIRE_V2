// Login.js
import React from 'react';
import styles from "./Login.module.css";
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className={styles.fundoLogin}>
            <form className={styles.formLogin}>
                <h2>Bem-vindo ao FIRE</h2> 
                
                <div className={styles.inputGroup}>
                    {/* <label htmlFor="nomeUsuario">Usuário/Email:</label>*/}
                    <input 
                        type="text" 
                        id="nomeUsuario" 
                        placeholder="Nome de usuário" 
                        className={styles.inputLogin}
                    />
                </div>
                
                <div className={styles.inputGroup}>
                    {/* <label htmlFor="senha">Senha:</label> */}
                    <input 
                        type="password" 
                        id="senha" 
                        placeholder="Senha" 
                        className={styles.inputLogin}
                    />
                </div>
                
                <button className={styles.entrar} type="submit">Entrar</button>

                {/* <div className={styles.linkAuxiliar}>
                    <p><Link to="/esqueceu-senha">Esqueceu a senha?</Link></p>
                    <p>Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
                </div> */}
            </form>
        </div>
    )
}

export default Login;