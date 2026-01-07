const elements = document.querySelectorAll('[data-animate]');

function animateOnScroll() {
  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (position < screenHeight - 100) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', animateOnScroll);
animateOnScroll();




const carousel = document.getElementById('carousel');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
let scrollPosition = 0;

next.addEventListener('click', () => {
  const width = carousel.clientWidth;
  scrollPosition = Math.min(scrollPosition + width, carousel.scrollWidth - width);
  carousel.style.transform = `translateX(-${scrollPosition}px)`;
});

prev.addEventListener('click', () => {
  const width = carousel.clientWidth;
  scrollPosition = Math.max(scrollPosition - width, 0);
  carousel.style.transform = `translateX(-${scrollPosition}px)`;
});
// Seleciona todas as imagens do carrossel
const imagens = document.querySelectorAll('#carousel img');
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
const fechar = document.querySelector('.close');

// Quando clicar na imagem
imagens.forEach(img => {
  img.addEventListener('click', () => {
    modal.style.display = 'block';
    modalImg.src = img.src;
  });
});

// Fechar o modal
fechar.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fechar clicando fora da imagem
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});




