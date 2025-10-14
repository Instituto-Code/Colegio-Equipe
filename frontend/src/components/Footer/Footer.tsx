import logoFooter from '../../assets/Images/Logo-Equipe.png'
import whatsapp_icon from '../../assets/Icons/Whatsapp_icon.png'
import instagram_logo from '../../assets/Icons/Instagram_icon.png'

// Footer da landing page.
export const Footer = () => {
  return (

    <footer id="footer_ce" className="flex flex-col w-full bg-[#1d1d2e] text-white text-[1em] font-[var(--fonte-1)]">
      <div className=" footer-container flex w-full flex-wrap justify-between mx-auto
        md:flex-row max-[630px]:flex-col max-[630px]:justify-center max-[630px]:items-center max-[630px]:text-center max-[630px]:gap-[10vw]"
      >
        <div className="footer-brand flex flex-col justify-center items-center text-center flex-[1_1_250px] m-[10px] max-[630px]:flex-none max-[630px]:m-0">
          <div id="logo_footer" className="flex">
            <img src={logoFooter} className="footer_logo w-[15vw] max-[630px]:w-[40vw]" />
          </div>
          <p className='p-4'>
            Educação de qualidade para um futuro brilhante.
          </p>
        </div>

        <div className="footer-links flex flex-col justify-center items-center text-center flex-[1_1_250px] m-[10px] max-[630px]:flex-none max-[630px]:m-0">
          <h3 className="mb-[10px]">Navegação</h3>
          <ul className="list-none p-0">
            <li className="mb-[6px]">
              <a href="#texts_qs" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                Quem Somos
              </a>
            </li>
            <li className="mb-[6px]">
              <a href="#texts_mission" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                Missão
              </a>
            </li>
            <li className="mb-[6px]">
              <a href="#texts_vision" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                Visão
              </a>
            </li>
            <li className="mb-[6px]">
              <a href="#texts_values" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                Valores
              </a>
            </li>
            <li className="mb-[6px]">
              <a href="#" className="text-[#ccc] no-underline transition-colors duration-300 hover:text-white">
                Cadastre-se
              </a>
            </li>
          </ul>
        </div>

        <div className="footer_social flex flex-col justify-center items-center text-center flex-[1_1_250px] m-[10px] max-[630px]:flex-none max-[630px]:m-0">
          <h3 className="mb-[10px]">Redes Sociais</h3>
          <div className="social-icons flex gap-[20px]">
            <a href="https://instagram.com/colegioequipe__" target="_blank" rel="noopener noreferrer">
              <img src={instagram_logo} className="footer_logo_sm w-[40px] transition-transform duration-200 hover:scale-110" />
            </a>
            <a href="https://api.whatsapp.com/send/?phone=5583996249381&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
              <img src={whatsapp_icon} className="footer_logo_sm w-[40px] transition-transform duration-200 hover:scale-11" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center mt-[30px] border-t border-[#333] pt-[10px] text-[14px] text-[#aaa]">
        <p>&copy; 2025 Colégio Equipe. Todos os direitos reservados.</p>
      </div>
    </footer>


  )
}