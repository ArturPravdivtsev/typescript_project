import { renderSearchFormBlock, search } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock, getUserData, getFavoritesAmount } from './user.js'
// import { renderToast } from './lib.js'

window.addEventListener('DOMContentLoaded', () => {
  const userData = getUserData();
  const favouritesAmount = getFavoritesAmount();
  if (userData) renderUserBlock(userData.userName, userData.avatarUrl, favouritesAmount);
  renderSearchFormBlock()
  renderSearchStubBlock()
  // renderToast(
  //   { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
  //   { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  // )
  const searchButton = window.document.getElementById('searchButton')

  searchButton.addEventListener('click', (e: Event) => {
    const SearchFormData = search(e);
    console.log(SearchFormData)
  })
})
