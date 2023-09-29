import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const form = document.getElementById('search-form');
const searchInput = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const loaderEl = document.querySelector(".loader");
 loaderEl.style.display = "none";
let page = 1;
const API_KEY = '39726621-0de1827bbfc07c5637e439509';
btnLoadMore.style.display = 'none';

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: "alt",
    captionDelay: 250,
});

const getData = async (query) => {
  loaderEl.style.display = "block";

    try {
        const options = {
            method: 'GET',
            url: `https://pixabay.com/api/?page=${page}&per_page=40`,
            params: {
                key: API_KEY,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true
            }
        };
      
        const response = await axios(options);
           loaderEl.style.display = "none";
        const data = response.data;
        return data;
    } catch (error) {
        loaderEl.style.display = "none";
     Notiflix.Notify.failure('Oops!Looks like something went completely wrong!No worries bro ,try later!');
        throw error;
    }
}

form.addEventListener("submit", handleSubmit);
btnLoadMore.addEventListener('click',getMorePhotos)
async function handleSubmit(event) {
    event.preventDefault();
    
    const searchQuery = searchInput.value; 
    gallery.innerHTML = '';
     page = 1;
    try {
        const photoData = await getData(searchQuery);
         Notiflix.Notify.info(`Hooray! We found ${photoData.totalHits} images.`);
        const arrPhoto = photoData.hits;
        if (arrPhoto.length === 0) {
            return Notiflix.Notify.info('"Sorry, there are no images matching your search query. Please try again."');
        }else {
        const markup = createPhotoCardMarkup(arrPhoto)
            gallery.innerHTML = markup;
            const lightbox = new SimpleLightbox('.gallery a');
            btnLoadMore.style.display = 'block';
            // form.reset();
        }

    } catch (error) {
          loaderEl.style.display = "none";
     Notiflix.Notify.failure('Oops!Looks like something went completely wrong!No worries bro ,try later!');
        throw error;
    }
}

function createPhotoCardMarkup(arr) {
    return arr.map(({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) => {
           return  `<div class="photo-card">
<a href="${largeImageURL}" data-lightbox="my-gallery">  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b><span class="info-title">Likes:</span> ${likes}</b>
    </p>
    <p class="info-item">
      <b><span class="info-title">Views:</span>${views}</b>
    </p>
    <p class="info-item">
      <b><span class="info-title">Comments:</span>${comments}</b>
    </p>
    <p class="info-item">
      <b><span class="info-title">Downloads:</span>${downloads}</b>
    </p>
  </div>
</div>`
        }).join('')
}

async function getMorePhotos() {
    page += 1;
     loaderEl.style.display = "block";
    try {
        const morePhotoData = await getData(searchInput.value);
        const morePhotos = morePhotoData.hits;
            loaderEl.style.display = "none";
        if (morePhotos.length === 0) {
            btnLoadMore.style.display = 'none';
            return Notiflix.Notify.info('No more images found.');
        } else {
            const markup = createPhotoCardMarkup(morePhotos);
            gallery.insertAdjacentHTML('beforeend', markup);
            lightbox.refresh(); 
    
        }
    } catch (error) {
            loaderEl.style.display = "none";
     Notiflix.Notify.failure('Oops!Looks like something went completely wrong!No worries bro ,try later!');
        throw error;
    }
}
