import { BrowserRouter as Router,Routes, Route } from "react-router-dom";



import Home from "./componentes/paginas/Home.js"
import Gerenciar from "./componentes/paginas/Gerenciar.js";
import Login from "./componentes/paginas/Login.js"

function App() {
  return (
    <Router >
     
        <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/gerenciar" element={<Gerenciar/>} />
            <Route exact path="/login" element={<Login/>} />
        </Routes>
    </Router>
  );
}

export default App;
