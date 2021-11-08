import { renderBlock } from './lib.js'
export interface IPlace {
  id: number,
  title: string,
  details: string,
  photos: string,
  remoteness: number,
  bookedDates: Array<string>|null,
  price: number
}

export async function getPlaces(): Promise<IPlace[]> {
  const places = await fetch('http://localhost:3000/places')
    .then((res) => {
      if(res.ok) return res.json()
      return null;
    })
    .then((data) => {
      return data;
    });
  return places;
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

export function renderEmptyOrErrorSearchBlock(reasonMessage) {
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

export async function renderSearchResultsBlock(places) {
  if(!places) return renderEmptyOrErrorSearchBlock('not found');
  let searchResult = '';
  const favorites = JSON.parse(localStorage.getItem('favoriteItems'));
  console.log(favorites)
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
              <p class="name">${place.title}</p>
              <p class="price">${place.price} &#8381;</p>
            </div>
            <div class="result-info--map"><i class="map-icon"></i> ${place.remoteness}км от вас</div>
            <div class="result-info--descr">${place.details}</div>
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
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      ${searchResult}
    </ul>
    `
  )
}
