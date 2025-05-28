
import Container from "../layout/Container";
import Card from "../layout/Card";
import Menu from "../layout/Menu";
function Gerenciar() {
    return(
        <div >
            <Menu/>
            <div className="alertaCards">
                <Container>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei"/>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei"/>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei"/>
                </Container>

            </div>
            <div className="alertaStatus">
                <Container>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei" customClass="grave"/>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei" customClass="alerta"/>
                    <Card nome="Teste" temperatura="36.5" umidade="12" pressao="22" co2="não sei"/>
                </Container>

            </div>
        </div>
    )
}

export default Gerenciar;