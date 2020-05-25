'use strict';
const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      tvCardImg = document.querySelectorAll('.tv-card__img');

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

leftMenu.addEventListener('click', event => {
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

tvCardImg.forEach((elem) => {
  const src = elem.src;
  elem.addEventListener('mouseenter', () => {
    elem.src = elem.getAttribute('data-backdrop');
  });
  elem.addEventListener('mouseleave', () => {
    elem.src = src;
  });
});