const slides = document.getElementById("slides")
const totalSlides = document.querySelectorAll(".slide").length
let index = 0

//Função para passar as imagens do slider.
function updateSlide(){
    slides.style.transform = `translateX(-${index * 100}%)`
}

//Intervalo de 5 segundos entre cada transição.
setInterval(()=>{
    index = (index + 1) % totalSlides
    updateSlide()
},5000)

const slider_ev = document.getElementById("slider_ev")
const slides_ev = slider_ev.querySelector(".slides_ev")
const dots = document.querySelectorAll(".dot")
const total = slides_ev.children.length

let index_2 = 0
let startX = 0
let currentX = 0
let isDragging = false

// Atualiza visual
function updateSlider() {
  slides_ev.style.transform = `translateX(-${index_2 * 100}%)`
  dots.forEach(dot => dot.classList.remove("active"))
  dots[index_2].classList.add("active")
}

// Função de início (mouse)
function startDrag(x) {
  isDragging = true
  startX = x
}

// Função de movimento
function moveDrag(x) {
  if (!isDragging) return
  currentX = x
}

// Função de fim
function endDrag(x) {
  if (!isDragging) return
  isDragging = false
  currentX = x

  const diffX = currentX - startX
  if (Math.abs(diffX) > 50) {
    if (diffX < 0) {
      index_2 = (index_2 + 1) % total
    } else {
      index_2 = (index_2 - 1 + total) % total
    }
    updateSlider()
  }
}

// Função que detecta clique na imagem para avançar ou voltar
function clickSlide(e) {
  const rect = slider_ev.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const width = rect.width

  if (clickX < width / 2) {
    index_2 = (index_2 - 1 + total) % total
  } else {
    index_2 = (index_2 + 1) % total
  }
  updateSlider()
}

// Eventos de toque (mobile)
slider_ev.addEventListener("touchstart", e => startDrag(e.touches[0].clientX))
slider_ev.addEventListener("touchmove", e => moveDrag(e.touches[0].clientX))
slider_ev.addEventListener("touchend", e => endDrag(e.changedTouches[0].clientX))

// Remove todos os listeners de drag/swipe
slider_ev.removeEventListener("touchstart", e => startDrag(e.touches[0].clientX))
slider_ev.removeEventListener("touchmove", e => moveDrag(e.touches[0].clientX))
slider_ev.removeEventListener("touchend", e => endDrag(e.changedTouches[0].clientX))

// Agora, adiciona o evento click (desktop)
slides_ev.addEventListener("click", clickSlide)



