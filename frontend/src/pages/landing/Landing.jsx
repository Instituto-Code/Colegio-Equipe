import { Link } from "react-router-dom"

import img_logo from '../../assets/Images/Logo-Equipe.png'
import img_header from '../../assets/Images/Logo-Equipe.png'
import imagem_1 from '../../assets/Images/imagem_1.png'
import imagem_2 from '../../assets/Images/imagem_2.jpeg'
import imagem_3 from '../../assets/Images/imagem_3.jpeg'
import imagem_4 from '../../assets/Images/imagem_4.png'
import alvo from '../../assets/Images/alvo.png'
import valor from '../../assets/Images/valor.png'  
import visao from '../../assets/Images/visao.png'
import './Landing.css'
import { Slider1 } from "../../components/Sliders/Slider";
import { Footer }from "../../components/Footer/Footer";

// Tela de landing page.
export const LandingPage = () => {
    // Imagens para slider.
    const imagens_Slide1 = [imagem_1,imagem_2,imagem_3,imagem_4]

    return(
    <>
        <header id="landing_header">
            <div id="logo_header">
                <img src={img_header} />
            </div>
            
            <div id="btns_sections">
                <a className="a_sections" href="#sections_texts">Quem somos</a>
                <a className="a_sections" href="#text_mission">Propósitos</a>
                <button id="btn_header"><Link to="/register" >Cadastre-se</Link></button>
            </div>
        </header>

        <Slider1 imagens={imagens_Slide1}>
            <div className="content">  
                <div className="text_content">
                    <h1>Transforme seu futuro com educação de qualidade !</h1>
                    <h2>Na vanguarda da inovação educacional, nosso compromisso é transformar o aprendizado em uma experiência significativa e acessível para todos. Explore novos horizontes com métodos de ensino de ponta e recursos personalizados que atendem às necessidades dos alunos modernos.</h2>
                </div>
                <div className="logo_section">
                    <img src={img_logo} alt=""/>
                </div>
            </div>
        </Slider1>

        <section className="sections_texts" id="sections_texts">
            <div id="texts_qs">
                <h1>Quem somos?</h1>
                <h2>
                    O Colégio Equipe é uma instituição de ensino comprometida com a formação
                    de seus alunos, promovendo uma educação de excelência que valoriza o
                    desenvolvimento acadêmico, ético e social. Nossa missão é preparar
                    cidadãos conscientes, críticos e atuantes na sociedade, por meio de uma
                    abordagem pedagógica que estimula o pensamento reflexivo e a autonomia
                    intelectual.
                    <br />
                    <br />
                    Contamos com uma equipe de educadores dedicados. Oferecemos uma proposta
                    curricular alinhada às diretrizes educacionais contemporâneas,
                    integrando metodologias inovadoras para atender às necessidades de
                    nossos estudantes.
                    <br />
                    <br />
                    No Colégio Equipe, acreditamos que a educação vai além da sala de aula.
                    Por isso, incentivamos a participação em projetos sociais, atividades
                    culturais e esportivas, promovendo valores como respeito, solidariedade
                    e responsabilidade. Nosso compromisso é contribuir para a formação de
                    indivíduos preparados para os desafios do mundo atual, capazes de
                    transformar a realidade em que vivem.
                </h2>
            </div>
        </section>

        <section className="sections_texts" id="text_mission">
            <div className="cards">
                <div className="content_cards">
                    <div className="titles_cards">
                        <h1>Missão</h1>
                        <div className="lines">
                            <div className="line" style={{ backgroundColor: "#DB0F19" }} />
                            <div className="ball" style={{ backgroundColor: "#DB0F19" }} />
                        </div>
                    </div>
                    <div className="text_card">
                        Proporcionar um cenário de qualidade visando contribuir para a
                        formação de cidadãos capazes de construir uma sociedade fundamentada
                        nos princípios morais, éticos e humanos.
                    </div>
                </div>
                <div className="logo_cards">
                    <img src={alvo} />
                </div>
            </div>
        </section>

        <section className="sections_texts">
            <div className="cards" style={{ backgroundColor: "rgba(217, 217, 255, 0.30)" }}>
                <div className="content_cards">
                    <div className="titles_cards">
                        <h1>Visão</h1>
                        <div className="lines">
                            <div className="line" style={{ backgroundColor: "#FCD770" }} />
                            <div className="ball" style={{ backgroundColor: "#FCD770" }} />
                        </div>
                    </div>
                    <div className="text_card">
                        Ser um centro de referência no setor educacional, conhecido pela
                        excelência disciplinar e qualidade de ensino, formando cidadãos
                        críticos-construtivos capazes de formar uma sociedade mais justa.{" "}
                    </div>
                </div>
                <div className="logo_cards">
                    <img src={visao} />
                </div>
            </div>
        </section>

        <section className="sections_texts">
            <div className="cards">
                <div className="content_cards">
                    <div className="titles_cards">
                    <h1>Valores</h1>
                    <div className="lines">
                        <div className="line" style={{ backgroundColor: "#67E5DD" }} />
                        <div className="ball" style={{ backgroundColor: "#67E5DD" }} />
                    </div>
                </div>
                <div className="text_card" style={{ textAlign: "start" }}>
                    <ul>
                        <li>Amor pela educação</li>
                        <li>Ética</li>
                        <li>Respeito ás diferenças</li>
                        <li>Diálogos e interações</li>
                        <li>Tradição com espirito inovador</li>
                        <li>Responsabilidade e solidariedade</li>
                    </ul>
                </div>
            </div>
                <div className="logo_cards">
                    <img src={valor} />
                </div>
            </div>
        </section>
        
        <Footer/>
    </>

    )
}