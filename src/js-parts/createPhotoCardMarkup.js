export function createPhotoCardMarkup(arr) {
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