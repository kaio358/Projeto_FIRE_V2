import { Link } from "react-router-dom";

import styles from "./Menu.module.css";
function Menu() {
    return(
        <nav className={styles.containerMenu}>
            <ul className={styles.listaLinks}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/gerenciar">Gerenciar</Link></li>

            </ul>
        </nav>
    )
}

export default Menu;