import { useState } from 'react';
import styles from './Card.module.css'

function Card(props) {
    const [mouseEstaSobre, setMouseEstaSobre] = useState(false);
    const [valores,setValores] = useState()
    const mouseSobre = (valor) => {
        setMouseEstaSobre(true)
        setValores(valor)

    }
    const mouseFora = ()=> {
         setMouseEstaSobre(false)
    }
    return(
        <div className={styles.containerCard}>

            <div className={styles.divCard}>
                <h3 >{props.nome}</h3> 
            </div>
            <div className={styles.divCard} >
                <span 
                    onMouseEnter={()=> mouseSobre(props.temperatura)}
                    onMouseLeave={mouseFora}
                    className={`${styles.spanCard} ${styles[props.customClass]}`}
                >
                    Temperatura
                </span>
                  <span 
                    onMouseEnter={()=> mouseSobre(props.umidade)}
                    onMouseLeave={mouseFora}
                    className={`${styles.spanCard} ${styles[props.customClass]}`}
                >
                    Umidade
                </span>
                  <span 
                    onMouseEnter={()=> mouseSobre(props.pressao)}
                    onMouseLeave={mouseFora}
                    className={`${styles.spanCard} ${styles[props.customClass]}`}
                >
                    Pressão
                </span>
            </div>
            <div className={styles.divCard}>
                <span 
                    onMouseEnter={()=> mouseSobre(props.co2)}
                    onMouseLeave={mouseFora}
                    className={`${styles.spanCard} ${styles[props.customClass]}`}
                >
                    CO₂
                </span>
                <span 
                    onMouseEnter={()=> mouseSobre(props.co2)}
                    onMouseLeave={mouseFora}
                    className={`${styles.spanCard} ${styles[props.customClass]}`}
                >
                    TVOCs
                </span>
            </div>

            {mouseEstaSobre? <div className={`${styles.valoresCard} ${styles[props.customClass]}`} >{valores}</div> :''} 
        </div>
    )
}

export default Card;