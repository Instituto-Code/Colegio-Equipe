// Importação de módulos da biblioteca Swiper.
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

import './Slider.css'

// Primeiro slider da landing page.
export const Slider1 = ({ children, imagens }) => {
    return(
        <div className="Slider_1"> 
            {/* Slider */}
            <Swiper
            // Configurações do slider.
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            speed={1500}
            autoplay={{
                delay:3000
            }}
            loop={true}
            >   
                {/* Função para exibição de imagens */}
                {imagens.map((imgSrc, index) =>{
                    return(
                        <SwiperSlide className="children_Swiper" key={index}>
                            <img src={imgSrc} alt={`Slide ${index+1}`} className="swiper-slide"/>
                        </SwiperSlide>
                    )
                })}
            </Swiper>

            {/* Exibição de conteúdo dentro do slide */}
            {children}
        </div>
    )
}