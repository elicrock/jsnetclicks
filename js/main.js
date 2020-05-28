'use strict';
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu'),
      hamburger = document.querySelector('.hamburger'),
      tvShowsList = document.querySelector('.tv-shows__list'),
      modal = document.querySelector('.modal'),
      tvShows = document.querySelector('.tv-shows'),
      tvCardImg = document.querySelector('.tv-card__img'),
      modalTitle = document.querySelector('.modal__title'),
      genresList = document.querySelector('.genres-list'),
      rating = document.querySelector('.rating'),
      description = document.querySelector('.description'),
      modalLink = document.querySelector('.modal__link'),
      preloader = document.querySelector('.preloader'),
      searchForm = document.querySelector('.search__form'),
      searchFormInput = document.querySelector('.search__form-input'),
      tvShowsHead = document.querySelector('.tv-shows__head');
      
const loading = document.createElement('div');
loading.className = 'loading';
tvShowsHead.textContent = '';


const DBService = class {

  constructor() {
    this.SERVER = 'https://api.themoviedb.org/3';
    this.API_KEY = 'f827fc972e4e548f3b85d8a8349b966f';
  }

  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Not enought data from : ${url}`);
    }
  }
  getTestData = () => {
    return this.getData('test.json');
  }

  getTestCard = () => {
    return this.getData('card.json');
  }

  getSearchResult = query => {
    return this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`);
  }

  getTvShow = id => {
    return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
  }
}

const renderCard = response => {
  tvShowsList.textContent = '';
  if (response.results.length > 0) {
    tvShowsHead.textContent = 'Результат поиска';
    response.results.forEach(item => {
      const { 
        name: title,
        vote_average: vote,
        poster_path: poster,
        backdrop_path: backdrop,
        id,
       } = item;
      
      const posterIMG = poster ? IMG_URL + poster : backdrop ? IMG_URL + backdrop : 'img/no-poster.jpg';
      const backdropIMG = backdrop ? IMG_URL + backdrop : '';
      const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
  
      
      const card = document.createElement('li');
      card.className = 'tv-shows__item';
      card.innerHTML = `
        <a href="#" id="${id}" class="tv-card">
          ${voteElem}
          <img class="tv-card__img"
            src="${posterIMG}"
            data-backdrop="${backdropIMG}"
            alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
        </a>
      `;
  
      loading.remove();
      tvShowsList.append(card);
    });
  } else {
    tvShowsHead.textContent = 'По вашему запросу ничего не найдено!';
    loading.remove();
  }

};

// Поиск
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = searchFormInput.value.toLowerCase().trim();

  if (value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = '';
});

// Меню (открытие, закрытие и др.)
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
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

// Открытие модального окна
tvShowsList.addEventListener('click', event => {
  event.preventDefault();
  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {
    preloader.style.display = 'block';
    new DBService().getTvShow(card.id)
      .then(({ poster_path: posterPath, name: title, genres, vote_average: voteAverage, overview, homepage }) => {
        tvCardImg.src = IMG_URL + posterPath;
        tvCardImg.alt = title;
        modalTitle.textContent = title;
        
        genresList.textContent = '';
        for (const item of genres) {
          genresList.innerHTML += `<li>${item.name}</li>`;
        }
        
        rating.textContent = voteAverage;
        description.textContent = overview;
        modalLink.href = homepage;
      })
      .then(() => {
        preloader.style.display = '';
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
      });
  }
});

// Закрытие модального окна
modal.addEventListener('click', event => {
  if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
});

// Смена изображения при наведении
const changeImage = event => {
  const card = event.target.closest('.tv-shows__item');
  if (card) {
    const img = card.querySelector('.tv-card__img');
    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);