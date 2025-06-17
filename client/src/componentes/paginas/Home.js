import React, { useState } from 'react'; 
import styles from "./Home.module.css";
import Container from "../layout/Container";
import Menu from "../layout/Menu";
import GraficoHistorico from '../graficos/GraficosHistoricos'; 

function Home() {
    // Exemplo de como tornar o ano dinâmico com um seletor
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
    const anosDisponiveis = [2025,2024, 2023, 2022, 2021, 2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999,1998,1997,1996]; 

    return (
        <div>
            <Menu />
            <Container>
               

                <div className={styles.seletorContainer}>
                    <h1>Dashboard de Monitoramento de Queimadas</h1>
                    <p>Análise dos dados históricos fornecidos pelo INPE.</p>
                 
                    <div className={styles.graficoContainer}>
                        <label htmlFor="ano-select">Selecione o Ano:</label>
                        <select 
                            id="ano-select" 
                            className={styles.anoSelect}
                            value={anoSelecionado} 
                            onChange={(e) => setAnoSelecionado(e.target.value)}
                        >
                            {anosDisponiveis.map(ano => (
                                <option key={ano} value={ano}>{ano}</option>
                            ))}
                        </select>
                        <GraficoHistorico localidade="BRASIL" ano={anoSelecionado} />
                    </div>
                </div>

                

            
                {/* <div className={styles.graficoContainer}>
                    <h2>Comparativo entre Estados</h2>
                    <GraficoHistorico localidade="SP" ano={anoSelecionado} />
                </div> 
                */}

            </Container>
        </div>
    );
}

export default Home;