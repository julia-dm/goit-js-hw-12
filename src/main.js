import { getPicture } from './js/pixibay-api.js';
import { showSearchResults } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const defaults = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('.search-input'),
  gallery: document.querySelector('.card-container'),
  loader: document.querySelector('.loader'),
  loadMore: document.querySelector('.load-more'),
  btnLoad: document.querySelector('.btn'),
};

const params = {
  q: '',
  page: 1,
  per_page: 15,
  maxPage: 0,
};

const lightbox = new simpleLightbox('.card-container a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const buttonService = {
  hide(button) {
    button.classList.add('is-hidden');
  },
  show(button) {
    button.classList.remove('is-hidden');
  },
  disable(button) {
    button.disabled = true;
  },
  enable(button) {
    button.disabled = false;
  },
};

defaults.searchForm.addEventListener('submit', handleSearch);
defaults.btnLoad.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();
  defaults.gallery.innerHTML = '';
  buttonService.hide(defaults.btnLoad);
  defaults.loader.classList.remove('visually-hidden');

  params.page = 1;
  const form = event.currentTarget;
  params.q = form.elements.query.value.trim();

  if (!params.q) {
    iziToast.error({
      iconUrl: './img/error.svg',
      message: 'Search field cannot be empty!',
      position: 'topRight',
      backgroundColor: '#ef4040',
      messageColor: 'white',
      titleColor: 'white',
    });
    defaults.loader.classList.add('visually-hidden');
    return;
  }

  try {
    const { totalHits, hits } = await getPicture(params);
    params.maxPage = Math.ceil(totalHits / params.per_page);

    defaults.gallery.innerHTML = showSearchResults(hits);

    if (hits.length > 0 && params.page < params.maxPage) {
      buttonService.show(defaults.btnLoad);
    } else {
      buttonService.hide(defaults.btnLoad);
      iziToast.info({
        iconUrl: './img/info.svg',
        message: "We're sorry, but there are no more results.",
        position: 'topRight',
        backgroundColor: '#09f',
        messageColor: 'white',
        titleColor: 'white',
      });
    }

    lightbox.refresh();
  } catch (err) {
    console.error(`Error during request: ${err}`);
    iziToast.error({
      iconUrl: './img/error.svg',
      message: `Error during request: ${err}`,
      position: 'topRight',
      backgroundColor: '#ef4040',
      messageColor: 'white',
      titleColor: 'white',
    });
  } finally {
    form.reset();
    defaults.loader.classList.add('visually-hidden');
  }
}

async function handleLoadMore() {
  buttonService.hide(defaults.btnLoad);
  defaults.loadMore.classList.remove('visually-hidden');
  params.page += 1;

  try {
    const { hits } = await getPicture(params);
    defaults.gallery.insertAdjacentHTML('beforeend', showSearchResults(hits));

    const cardHeight = getCardHeight();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (params.page >= params.maxPage) {
      buttonService.hide(defaults.btnLoad);
      iziToast.info({
        iconUrl: './img/info.svg',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        backgroundColor: '#09f',
        messageColor: 'white',
        titleColor: 'white',
      });
    } else {
      buttonService.show(defaults.btnLoad);
    }

    lightbox.refresh();
  } catch (err) {
    console.error(`Error during request: ${err}`);
    iziToast.error({
      iconUrl: './img/error.svg',
      message: `Error during request: ${err}`,
      position: 'topRight',
      backgroundColor: '#ef4040',
      messageColor: 'white',
      titleColor: 'white',
    });
  } finally {
    buttonService.enable(defaults.btnLoad);
    defaults.loadMore.classList.add('visually-hidden');
  }
}

function getCardHeight() {
  const card = document.querySelector('.card-container .card');
  return card ? card.getBoundingClientRect().height : 0;
}
