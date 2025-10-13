// Importação de módulos da biblioteca Swiper.
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

// Primeiro slider da landing page.
export const Slider1 = ({ children, imagens }) => {
    return(
      <div className = "flex relative items-center justify-center h-screen w-full max-sm:items-center max-sm:h-[90vh] "
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          speed={1500}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="flex w-full h-full max-h-full min-h-full transition-all duration-1000 ease-in-out"
        >
          {imagens.map((imgSrc, index) => (
            <SwiperSlide
              key={index}
              className=" flex w-screen max-h-full min-h-full transition-all duration-1000 ease-in-out"
            >
              <img
                src={imgSrc}
                alt={`Slide ${index + 1}`}
                className="flex w-full h-full object-cover flex-shrink-0"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {children}
      </div>
    )
}