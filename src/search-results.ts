import { renderBlock } from './lib.js'
import { sortByPriceAsc, sortByPriceDesc, sortByRemoteAsc } from './search-form.js'
import { Place } from './place.js';
export interface IPlace {
  id: number,
  title: string,
  details: string,
  photos: string,
  remoteness: number,
  bookedDates: Array<string>|null,
  price: number
}

export function renderSearchStubBlock() {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock(reasonMessage: string) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export async function renderSearchResultsBlock(places: Place[]) {
  localStorage.setItem('places', JSON.stringify(places))
  if(!places) return renderEmptyOrErrorSearchBlock('not found');
  let searchResult = '';
  const favorites = JSON.parse(localStorage.getItem('favoriteItems') || '{}');
  for(const id in places) {
    const place = places[id];
    searchResult += `
      <li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div class="favorites ${favorites[id] ? 'active' : ''}" data-id="${place.id}"></div>
            <img class="result-img" src="${place.photos}" alt="">
          </div>
          <div class="result-info">
            <div class="result-info--header">
              <p class="name">${place.name}</p>
              <p class="price">${place.price} &#8381;</p>
            </div>
            <div class="result-info--map"><i class="map-icon"></i> ${place.remoteness ? place.remoteness : '?'}км от вас</div>
            <div class="result-info--descr">${place.description}</div>
            <div class="result-info--footer">
              <div>
                <button>Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </li>
    `;
  }
  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select id="sortSelect">
                <option name="asc" value="asc">Сначала дешёвые</option>
                <option name="desc" value="desc">Сначала дорогие</option>
                <option name="remote" value="remote">Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      ${searchResult}
    </ul>
    `
  )

  const sortSelect = window.document.getElementById('sortSelect')
  sortSelect?.addEventListener('change', (evt: Event) => {
    const data = JSON.parse(localStorage.getItem('places') || '{}');
    const element = evt.currentTarget as HTMLInputElement
    const value = element.value
    if (value === 'asc') {
      data.sort(sortByPriceAsc);
    }
    if (value === 'desc') {
      data.sort(sortByPriceDesc);
    }
    if (value === 'remote') {
      data.sort(sortByRemoteAsc);
    }
    renderSearchResultsBlock(data);
  })
}
