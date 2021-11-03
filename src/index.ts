import { renderSearchFormBlock, search } from './search-form.js'
import { getPlaces, renderSearchResultsBlock } from './search-results.js'
import { renderUserBlock, getUserData, getFavoritesAmount } from './user.js'
import { toggleFavoriteItem } from './favourites.js'
// import { renderToast } from './lib.js'

window.addEventListener('DOMContentLoaded', async () => {
  const userData = getUserData();
  const favoritesAmount = getFavoritesAmount();
  if (userData) renderUserBlock(userData.userName, userData.avatarUrl, favoritesAmount);
  renderSearchFormBlock()
  // renderSearchStubBlock()
  // renderToast(
  //   { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
  //   { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  // )
  const searchButton = window.document.getElementById('searchButton')

  searchButton.addEventListener('click', (e: Event) => {
    search(e).then((data) => renderSearchResultsBlock(data));
  })
  const places = await getPlaces();
  await renderSearchResultsBlock(places);

  const favoriteElements = document.querySelectorAll('.favorites');
  favoriteElements.forEach((element) => {
    element.addEventListener('click', (e: Event) => {
      if (e.target instanceof Element) {
        const id = +e.target.getAttribute('data-id');
        const resultElem = e.target.closest('.result');
        toggleFavoriteItem(resultElem, id)
      }
    });
  });
})
