import { BrowserRouter as Router,Routes, Route } from "react-router-dom";


// rotas
import Home from "./componentes/paginas/Home.js"
import Gerenciar from "./componentes/paginas/Gerenciar.js";
import Login from "./componentes/paginas/Login.js"
import Cadastro  from "./componentes/paginas/Cadastro.js";
import AdminPage from "./componentes/paginas/AdminPage.js";

// para Token
import { AuthProvider } from './componentes/funcionalidades/AuthContext.js';

function App() {
  return (
    <AuthProvider>

      <Router >
        
          <Routes>
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/gerenciar" element={<Gerenciar/>} />
              <Route exact path="/login" element={<Login/>} />
              <Route exact path="/cadastro" element={<Cadastro/>} />
              <Route exact path="/adminPage" element={<AdminPage/>} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
