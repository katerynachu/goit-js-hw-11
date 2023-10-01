import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { getData } from "./js-parts/getData";
import { createPhotoCardMarkup } from "./js-parts/createPhotoCardMarkup.js";

const form = document.getElementById('search-form');
const searchInput = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const loaderEl = document.querySelector(".loader");
loaderEl.style.display = "none";
let page = 1;
btnLoadMore.style.display = 'none';

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: "alt",
    captionDelay: 250,
});

form.addEventListener("submit", handleSubmit);
btnLoadMore.addEventListener('click', getMorePhotos)


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
            lightbox.refresh(); 
            btnLoadMore.style.display = 'block';

        }

    } catch (error) {
          loaderEl.style.display = "none";
     Notiflix.Notify.failure('Oops!Looks like something went completely wrong!No worries bro ,try later!');
        throw error;
    }
}



async function getMorePhotos() {
    page += 1;
    loaderEl.style.display = "block";
    try {
        const morePhotoData = await getData(searchInput.value, page);
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
        Notiflix.Notify.failure('Oops! Looks like something went completely wrong! No worries bro, try later!');
        throw error;
    }
}