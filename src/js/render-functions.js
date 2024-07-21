function showSearchResults(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" width="360" height="152" />
            <ul class="description">
              <li class="description-items">
                <span class="item">Likes </span>${likes}
              </li>
              <li class="description-items">
                <span class="item">Views </span>${views}
              </li>
              <li class="description-items">
                <span class="item">Comments </span>${comments}
              </li>
              <li class="description-items">
                <span class="item">Downloads </span>${downloads}
              </li>
            </ul>
          </a>
        </li>`
    )
    .join('');
}

export { showSearchResults };
