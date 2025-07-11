import './Footer.css'
import logoFooter from '../../assets/Images/Logo-Equipe.png'
import whatsapp_icon from '../../assets/Icons/Whatsapp_icon.png'
import instagram_logo from '../../assets/Icons/Instagram_icon.png'

// Footer da landing page.
export const Footer = () => {
    return(
        <footer id="footer_ce">
        <div className="footer-container">
          <div className="footer-brand">
            <div id="logo_footer">
                <img src={logoFooter} className='footer_logo'/>
            </div>
            <p>Educação de qualidade para um futuro brilhante.</p>
          </div>
      
          <div className="footer-links">
            <h3>Navegação</h3>
            <ul>
              <li><a href="#texts_qs">Quem Somos</a></li>
              <li><a href="#texts_mission">Missão</a></li>
              <li><a href="#texts_vision">Visão</a></li>
              <li><a href="#texts_values">Valores</a></li>
              <li><a href="#">Cadastre-se</a></li>
            </ul>
          </div>
      
          <div className="footer-social">
            <h3>Redes Sociais</h3>
            <div class="social-icons">
                <a href="https://instagram.com/colegioequipe__" target="_blank" rel="noopener noreferrer"><img src={whatsapp_icon} className='footer_logo_sm'/></a>
                <a href="https://api.whatsapp.com/send/?phone=5583996249381&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer"><img src={instagram_logo} className='footer_logo_sm'/></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Colégio Equipe. Todos os direitos reservados.</p>
        </div>
      </footer>
    )
}