const slides = document.getElementById("slides")
const totalSlides = document.querySelectorAll(".slide").length
let index = 0

function updateSlide(){
    slides.style.transform = `translateX(-${index * 100}%)`
}

setInterval(()=>{
    index = (index + 1) % totalSlides
    updateSlide()
},5000)