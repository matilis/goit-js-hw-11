import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { newPhoto } from './newPhoto';

const formEl = document.querySelector('.search-form');
const btnEl = document.querySelector('.search-image');
const inputEl = document.querySelector('input');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.visibility = 'hidden';
let page = 1;
let totalPages = 40;

const photoParams = async () => {
  const API_URL = 'https://pixabay.com/api/?';
  const photoParamsUrl = await axios.get(API_URL, {
    params: {
      key: '36028028-2964cb2561d4c05b8daf5348d',
      q: inputEl.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: totalPages,
    },
  });
  return photoParamsUrl;
};

// OR

// const photoParams = async () => {
//   const API_URL = 'https://pixabay.com/api/?';
//   return await axios.get(API_URL, {
//     params: {
//       key: '36028028-2964cb2561d4c05b8daf5348d',
//       q: inputEl.value,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: 'true',
//       page: page,
//       per_page: totalPages,
//     },
//   });
// };

const fetchPhotos = () => {
  photoParams()
    .then(response => {
      const totalHits = response.data.total;

      if (response.data.hits.length === 0) throw new Error();

      totalHits / page > 40
        ? (loadMoreBtn.style.visibility = 'visible')
        : (loadMoreBtn.style.visibility = 'hidden');

      galleryEl.innerHTML = newPhoto(response);

      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

      let lightbox = new SimpleLightbox('.gallery a');
    })

    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
};

const onClick = () => {
  setTimeout(() => {
    fetchPhotos();
  }, 1000);
};

const fetchNewPhotos = () => {
  photoParams().then(response => {
    const totalHits = response.data.total;

    totalHits / page > 40
      ? (loadMoreBtn.style.visibility = 'visible')
      : (loadMoreBtn.style.visibility = 'hidden');

    galleryEl.insertAdjacentHTML('beforeend', newPhoto(response));

    let lightbox = new SimpleLightbox('.gallery a');

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
};

const backgroundShadow = () => {
  galleryEl.classList.add('background-shadow');
};
btnEl.addEventListener('click', event => {
  event.preventDefault();
  page = 1;
  onClick();
  backgroundShadow();
});

loadMoreBtn.addEventListener('click', () => {
  page++;
  fetchNewPhotos();
});
