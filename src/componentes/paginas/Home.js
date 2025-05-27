import styles from "./Home.module.css"
import Container from "../layout/Container";
import Menu from "../layout/Menu";
function Home() {
    return(
        <div>
            <Menu/>
            <Container>
                teste
            </Container>
            {/* <div className={styles.principal}> 
                Home
            </div> */}
        </div>
    )
}

export default Home;