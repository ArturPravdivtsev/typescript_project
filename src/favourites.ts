

export function toggleFavoriteItem(resultElem: Element, id: number) {
  const image = resultElem.querySelector('.result-img').getAttribute('src')
  const name = resultElem.querySelector('.name').textContent;
  const favorite = resultElem.querySelector('.favorites');
  const favorites = JSON.parse(localStorage.getItem('favoriteItems'));

  if (favorites[id]) {
    delete favorites[id];
    favorite.classList.remove('active');
  } else {
    favorites[id] = {
      id,
      name ,
      image
    }
    favorite.classList.add('active');
  }
  localStorage.setItem('favoriteItems', JSON.stringify(favorites))
}
