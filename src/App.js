import { BrowserRouter as Router,Routes, Route } from "react-router-dom";

import Menu from "./componentes/layout/Menu";

import Home from "./componentes/paginas/Home"
import Gerenciar from "./componentes/paginas/Gerenciar";

function App() {
  return (
    <Router >
        <Menu/>
        <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/gerenciar" element={<Gerenciar/>} />
        </Routes>
    </Router>
  );
}

export default App;
