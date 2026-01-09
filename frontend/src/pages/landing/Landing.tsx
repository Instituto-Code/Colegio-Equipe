import { Link } from "react-router-dom";

import img_logo from "../../assets/Images/Logo-Equipe.png";
import img_header from "../../assets/Images/Logo-Equipe.png";
import imagem_1 from "../../assets/Images/imagem_1.png";
import imagem_2 from "../../assets/Images/imagem_2.jpeg";
import imagem_3 from "../../assets/Images/imagem_3.jpeg";
import imagem_4 from "../../assets/Images/imagem_4.png";
import alvo from "../../assets/Images/alvo.png";
import valor from "../../assets/Images/valor.png";
import visao from "../../assets/Images/visao.png";
//Componentes criados manualmente
import { Slider1 } from "../../components/Sliders/Slider";
import { Footer } from "../../components/Footer/Footer";
import { useAuth } from "../../contexts/authContext";

import { Dropdown } from "@/components/Dropdown/Dropdown";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ScrollLinked } from "@/components/Motions/ScrollProgress";
import { AnimatedImage } from "@/components/Motions/ImageOpacity";
import { CheckCircle } from "lucide-react";
// import { DropdownMenu } from "@radix-ui/react-dropdown-menu"

// Tela de landing page.
export const LandingPage = () => {

  // Imagens para slider.
  const imagens_Slide1 = [imagem_1, imagem_2, imagem_3, imagem_4];

  //Funções do useAuth.
  const { user, logout, loading, token } = useAuth();

  //Pegando o token do localStorege para renderizar ou não o nome do usuário.
  //const token = localStorage.getItem("token");

  return (
    <>
      <header className="flex fixed z-50 mb-2.5 top-0 left-0 bg-background w-full justify-between items-center p-1">
        <div className="flex">
          <Link to={"/"}>
            <img src={img_header} className="w-[7vw] max-sm:w-[25vw] " />
          </Link>
        </div>
        <div className="flex items-center pr-[1.5vw] gap-[3vw]">
          <a
            className="flex max-sm:hidden text-foreground justify-center font-normal text-[1.2vw] font-[Inter] cursor-pointer no-underline [630px]:hidden"
            href="#sections_texts"
          >
            Quem somos
          </a>
          <a
            className="flex max-sm:hidden text-foreground justify-center font-normal text-[1.2vw] font-[Inter] cursor-pointer no-underline [630px]:hidden"
            href="#text_mission"
          >
            Propósitos
          </a>
          {/* Se não tiver user e estiver buscando aparece o loading */}
          {user ? (
            loading ? (
              <Spinner />
            ) : (
              <Dropdown name={user!.name} role={user!.role} logout={logout} />
            )
          ) : (
            loading ? (
              <Spinner className="size-8 text-blue-500" /> ) : (
            <Link to="/register">
              <Button
                className="font-normal text-[1.3vw] max-sm:text-[4.5vw] font-[Inter] bg-backgorund text-foreground hover:bg-secondary border-0 rounded-[10px] cursor-pointer w-auto max-sm:w-[30vw] h-[2.4vw] max-sm:h-[10vw]"
              >
                Cadastre-se
              </Button>
            </Link>
            )
          )}
        </div>
      </header>
      
      <ScrollLinked />

      <Slider1 imagens={imagens_Slide1}>
        <div className="flex flex-col z-1 absolute items-center m-[5vw] p-5 text-center rounded-[30px] bg-[rgba(255,255,255,0.8)] sm:flex-row sm:justify-around sm:py-[6vw] sm:px-[5vw] sm:text-left [630px]:gap-[1vw]">
          <div className="flex flex-col gap-[4vb] text-black ">
            <h1 className="font-[Inter] text-[clamp(1.5rem,4vw,4.5rem)] ">
              Transforme seu futuro com educação de qualidade !
            </h1>
            <h2 className="font-normal font-[Inter] text-[clamp(0.7em,1.5vw,2em)]">
              Na vanguarda da inovação educacional, nosso compromisso é
              transformar o aprendizado em uma experiência significativa e
              acessível para todos. Explore novos horizontes com métodos de
              ensino de ponta e recursos personalizados que atendem às
              necessidades dos alunos modernos.
            </h2>
          </div>
          <div className="flex items-center">
            <img
              src={img_logo}
              className=" w-[clamp(30vw,100vw,200vw)]"
              alt=""
            />
          </div>
        </div>
      </Slider1>

      <section
        className="flex justify-center items-center my-[2vw]"
        id="sections_texts"
      >
        <div className="flex flex-col w-[95%] p-[0vw_5vw_5vw_5vw] max-sm:p-[5vw_5vw_10vw_5vw] shadow-[0px_0px_15px_rgb(141,141,141)] rounded-[1vw]">
          <h1 className="font-[Kumbh_Sans] font-light text-[5vw] max-sm:text-[3rem] max-sm:text-center my-[4vw]">
            Quem somos?
          </h1>
          <h2 className="font-[Inter] font-medium text-[1.5vw] max-sm:text-[0.9rem] max-sm:text-center">
            O Colégio Equipe é uma instituição de ensino comprometida com a
            formação de seus alunos, promovendo uma educação de excelência que
            valoriza o desenvolvimento acadêmico, ético e social. Nossa missão é
            preparar cidadãos conscientes, críticos e atuantes na sociedade, por
            meio de uma abordagem pedagógica que estimula o pensamento reflexivo
            e a autonomia intelectual.
            <br />
            <br />
            Contamos com uma equipe de educadores dedicados. Oferecemos uma
            proposta curricular alinhada às diretrizes educacionais
            contemporâneas, integrando metodologias inovadoras para atender às
            necessidades de nossos estudantes.
            <br />
            <br />
            No Colégio Equipe, acreditamos que a educação vai além da sala de
            aula. Por isso, incentivamos a participação em projetos sociais,
            atividades culturais e esportivas, promovendo valores como respeito,
            solidariedade e responsabilidade. Nosso compromisso é contribuir
            para a formação de indivíduos preparados para os desafios do mundo
            atual, capazes de transformar a realidade em que vivem.
          </h2>
        </div>
      </section>

      <section
        className="flex justify-center items-center my-[2vw]"
        id="text_mission"
      >
        <div className="flex items-center justify-between w-[95vw] rounded-[1vw] shadow-[0px_0px_15px_rgb(141,141,141)] max-sm:flex-col max-sm:justify-center max-sm:items-center">
          <div className="flex flex-col mt-[4vw] mr-[20vw] mb-0 ml-[5vw] max-sm:mt-[10vw] max-sm:mr-0 max-sm:ml-0 max-sm:items-center">
            <div className="flex flex-col">
              <h1 className="font-[Kumbh_Sans] font-light text-[5vw] max-sm:text-[2.4rem] max-sm:m-0">
                Missão
              </h1>
              <div className="flex items-center">
                <div className="flex w-full h-[1vh] bg-[#DB0F19]"></div>
                <div className="flex w-[4vw] aspect-[1/1] rounded-full bg-[#DB0F19] max-sm:hidden"></div>
              </div>
            </div>
            <div className="my-[5vw] font-[Inter] font-normal text-[1.8vw] max-sm:text-[1.2rem] max-sm:p-[0_5vw] max-sm:text-center">
              Proporcionar um cenário de qualidade visando contribuir para a
              formação de cidadãos capazes de construir uma sociedade
              fundamentada nos princípios morais, éticos e humanos.
            </div>
          </div>
          <div className="p-5">
            {/* <img src={alvo} className="w-[50vw] max-sm:w-[30vw]" /> */}
            <AnimatedImage src={alvo} className="w-[50vw] max-sm:w-[30vw]" />
          </div>
        </div>
      </section>

      <section className="flex justify-center items-center my-[2vw]">
        <div className="flex items-center justify-between w-[95vw] rounded-[1vw] shadow-[0px_0px_15px_rgb(141,141,141)]  max-sm:flex-col max-sm:justify-center max-sm:items-center">
          <div className="flex flex-col mt-[4vw] mr-[20vw] mb-0 ml-[5vw] max-sm:mt-[10vw] max-sm:mr-0 max-sm:ml-0 max-sm:items-center">
            <div className="flex flex-col">
              <h1 className="font-[Kumbh_Sans] font-light text-[5vw] max-sm:text-[2.4rem] max-sm:m-0">
                Visão
              </h1>
              <div className="flex items-center">
                <div className="flex w-full h-[1vh] bg-[#FCD770]"></div>
                <div className="flex w-[4vw] aspect-[1/1] rounded-full bg-[#FCD770] max-sm:hidden"></div>
              </div>
            </div>
            <div className="my-[5vw] font-[Inter] font-normal text-[1.8vw] max-sm:text-[1.2rem] max-sm:p-[0_5vw] max-sm:text-center">
              Ser um centro de referência no setor educacional, conhecido pela
              excelência disciplinar e qualidade de ensino, formando cidadãos
              críticos-construtivos capazes de formar uma sociedade mais justa.
            </div>
          </div>
          <div className="p-5">
            {/* <img src={visao} className="w-[50vw] max-sm:w-[30vw]" /> */}
            <AnimatedImage src={visao} className="w-[50vw] max-sm:w-[30vw]" />
          </div>
        </div>
      </section>

      <section className="flex justify-center items-center my-[2vw]">
        <div className="flex items-center justify-between w-[95vw] rounded-[1vw] shadow-[0px_0px_15px_rgb(141,141,141)] max-sm:flex-col max-sm:justify-center max-sm:items-center">
          <div className="flex flex-col mt-[4vw] mr-[20vw] mb-0 ml-[5vw] max-sm:mt-[10vw] max-sm:mr-0 max-sm:ml-0 max-sm:items-center">
            <div className="flex flex-col">
              <h1 className="font-[Kumbh_Sans] font-light text-[5vw] max-sm:text-[2.4rem] max-sm:m-0">
                Valores
              </h1>
              <div className="flex items-center">
                <div className="flex w-full h-[1vh] bg-[#67E5DD]"></div>
                <div className="flex w-[4vw] aspect-[1/1] rounded-full bg-[#67E5DD] max-sm:hidden"></div>
              </div>
            </div>
            <div className="my-[2vw] p-3 font-[Inter] font-normal text-[1.8vw] max-sm:text-[1.2rem] max-sm:p-[0_5vw] max-sm:text-center text-left">
              <ul>
                <li className="flex gap-1.5 items-center">
                  <CheckCircle className="text-[#00968c]" /> Amor pela educação
                </li>
                <li className="flex gap-1.5 items-center">
                  <CheckCircle className="text-[#00968c]" />Ética
                </li>
                <li className="flex gap-1.5 items-center">
                  <CheckCircle className="text-[#00968c]" />Respeito às diferenças
                </li>
                <li className="flex gap-1.5 items-center">
                  <CheckCircle className="text-[#00968c]" />Diálogos e interações
                </li>
                <li className="flex gap-1.5 items-center">
                  <CheckCircle className="text-[#00968c]" />Tradição com espírito inovador
                </li>
                <li className="flex gap-1.5 items-center">
                  <CheckCircle className="text-[#00968c]" />Responsabilidade e solidariedade
                </li>
              </ul>
            </div>
          </div>
          <div className="p-5">
            {/* <img src={valor} className="w-[16vw] max-sm:w-[30vw]" /> */}
            <AnimatedImage src={valor} className="w-[16vw] max-sm:w-[30vw]" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
