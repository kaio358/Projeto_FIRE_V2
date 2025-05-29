import { useState } from "react";
import { Link } from "react-router-dom";


import styles from "./Menu.module.css";
import arvore from "../../imagens/icone_arvore_sem_fundo.png";



function Menu() {
    const [conectado, setConectado] = useState(false) 
    return(
        <nav className={styles.containerMenu} >
            <div>
                <Link to="/">  <img src={arvore} className={styles.icone_site}/></Link>
              
         
            </div>
            <ul className={styles.listaLinks}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/gerenciar">Gerenciar</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
      
        </nav>
    )
}

export default Menu;