import { getAllPlaces, renderSearchFormBlock, search } from './search-form.js'
import { renderSearchResultsBlock } from './search-results.js'
import { renderUserBlock, getUserData, getFavoritesAmount } from './user.js'
import { toggleFavoriteItem } from './favourites.js'
// import { renderToast } from './lib.js'

window.addEventListener('DOMContentLoaded', async () => {
  const userData = getUserData();
  const favoritesAmount = getFavoritesAmount();
  if (userData) renderUserBlock(userData.userName, userData.avatarUrl, favoritesAmount);
  renderSearchFormBlock()
  const searchButton = window.document.getElementById('searchButton')

  searchButton.addEventListener('click', (evt: Event) => {
    search(evt).then((data) => renderSearchResultsBlock(data));
  })
  await getAllPlaces().then((data)=> renderSearchResultsBlock(data));

  const favoriteElements = document.querySelectorAll('.favorites');
  favoriteElements.forEach((element) => {
    element.addEventListener('click', (evt: Event) => {
      if (evt.target instanceof Element) {
        const id = +evt.target.getAttribute('data-id');
        const resultElem = evt.target.closest('.result');
        toggleFavoriteItem(resultElem, id)
      }
    });
  });
})
