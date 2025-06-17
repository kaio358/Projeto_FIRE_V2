
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Este componente recebe o componente a ser renderizado como 'element'
function AdminRoute({ element }) {
    const { usuario, token } = useAuth();

    // Se não houver token, o usuário nem está logado, redireciona para o login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Se o usuário logado não for um admin, redireciona para a home
    if (usuario && usuario.cargo !== 'admin') {
        // Você pode redirecionar para uma página de "Acesso Negado" s
        return <Navigate to="/" replace />;
    }

   
    return element;
}

export default AdminRoute;