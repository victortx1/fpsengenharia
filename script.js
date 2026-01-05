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
