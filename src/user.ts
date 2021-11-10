import { renderBlock } from './lib.js'

interface IUser {
  userName: string;
  avatarUrl: string;
}

export function renderUserBlock(userName: string, avatarLink: string, favoriteItemsAmount?: number) {
  const favoritesCaption = favoriteItemsAmount ? favoriteItemsAmount : 'ничего нет'
  const hasFavoriteItems = favoriteItemsAmount ? true : false

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatarLink}" alt="${userName}" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}

export function getUserData(): IUser|null {
  const userData = localStorage.getItem('user');
  try {
    return JSON.parse(userData || '{}');
  } catch (err) {
    return null;
  }
}

export function getFavoritesAmount(): number {
  return Object.keys(JSON.parse(localStorage.getItem('favoriteItems') || '{}')).length;
}
