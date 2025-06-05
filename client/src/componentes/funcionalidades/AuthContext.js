
import React, { createContext, useState, useEffect, useContext } from 'react';
// import { jwtDecode } from 'jwt-decode'; // decodificar o token para pegar dados do usuário. Instale com: npm install jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Tenta pegar o token do localStorage ao iniciar
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [usuario, setUsuario] = useState(null); 

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            try {
                // pegar dados do payload do token (ex: nome, id)
                // const decodedToken = jwtDecode(storedToken);
                // setUsuario({ id: decodedToken.userId, nome: decodedToken.nome /*, etc */ });

                const storedUser = localStorage.getItem('authUser');
                if (storedUser) {
                    setUsuario(JSON.parse(storedUser));
                }

            } catch (error) {
                console.error("Erro ao decodificar token ou buscar usuário:", error);
                // Token inválido ou expirado, limpa
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setToken(null);
                setUsuario(null);
            }
        }
    }, []); // Executa apenas uma vez ao montar o componente

    const loginAuth = (newToken, userData) => {
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('authUser', JSON.stringify(userData)); // Salva dados do usuário
        setToken(newToken);
        setUsuario(userData);
    };

    const logoutAuth = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUsuario(null);
        // Opcional: redirecionar para a página de login
        // window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ token, usuario, loginAuth, logoutAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
    return useContext(AuthContext);
};