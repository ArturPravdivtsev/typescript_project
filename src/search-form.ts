import { renderBlock, renderToast } from './lib.js'
import { Place } from './place.js';
import { SearchFilter } from './search-filter.js';
import { SdkProvider } from './providers/sdk/sdk-provider.js';
import { ApiProvider } from './providers/api/api-provider.js';

const api = new ApiProvider()
const sdk = new SdkProvider()

function join(t: Date, a: Intl.DateTimeFormatOptions[] | undefined, s: string) {
  function format(m: Intl.DateTimeFormatOptions | undefined) {
    const f = new Intl.DateTimeFormat('en', m);
    return f.format(t);
  }
  return a?.map(format).join(s);
}

function getLastDayOfMonth(year: number, month: number) {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
}

export function renderSearchFormBlock(checkInDate?: string, checkOutDate?: string) {
  const options = [{ year: 'numeric' }, { month: 'numeric' }, { day: '2-digit' }];
  const nextMonthDate = new Date();
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  nextMonthDate.setDate(getLastDayOfMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth()));
  const nextMonth = join(nextMonthDate, options as Intl.DateTimeFormatOptions[], '-');

  if (checkInDate) {
    const dateNow = join(new Date, options as Intl.DateTimeFormatOptions[], '-');
    if (dateNow && dateNow < checkInDate) {
      renderToast(
        { text: 'Дата заезда не может быть меньше текущей даты!', type: 'error' },
        { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
      );
    }
  } else {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + 1);
    checkInDate = join(dateNow, options as Intl.DateTimeFormatOptions[], '-');
  }

  if (checkOutDate) {
    if (nextMonth && checkOutDate > nextMonth) {
      renderToast(
        { text: 'Дата заезда не может быть меньше текущей даты!', type: 'error' },
        { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
      );
    }
  } else {
    if(checkInDate) {
      const date = new Date(checkInDate);
      date.setDate(date.getDate() + 2);
      checkOutDate = join(date, options as Intl.DateTimeFormatOptions[], '-');
    }
  }

  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${checkInDate}" min="${checkInDate}" max="${nextMonth}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${checkOutDate}" min="${checkInDate}" max="${nextMonth}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <label for="api">Использовать API для поиска</label>
            <input id="api" type="checkbox" value="" name="api" checked />
          </div>
          <div>
            <label for="sdk">Использовать SDK для поиска</label>
            <input id="sdk" type="checkbox" value="" name="sdk" />
          </div>
          <div>
            <div><button id="searchButton">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}

export function sortByPriceAsc(one: Place, two: Place) {
  if (one.price > two.price) {
    return 1
  } else if (one.price < two.price) {
    return -1
  } else {
    return 0
  }
}

export function sortByPriceDesc(one: Place, two: Place) {
  if (one.price < two.price) {
    return 1
  } else if (one.price > two.price) {
    return -1
  } else {
    return 0
  }
}

export function sortByRemoteAsc(one: Place, two: Place) {
  if (one.remoteness && two.remoteness) {
    if (one.remoteness > two.remoteness) {
      return 1
    } else if (one.remoteness < two.remoteness) {
      return -1
    } else {
      return 0
    }
  }
}

export function getAllPlaces() {
  const city = (window.document.getElementById('city') as HTMLInputElement).value;
  const checkInDate = new Date((window.document.getElementById('check-in-date') as HTMLInputElement).value);
  const checkOutDate = new Date((window.document.getElementById('check-out-date') as HTMLInputElement).value);
  const maxPrice = (window.document.getElementById('max-price') as HTMLInputElement).value;
  const priceLimit = maxPrice !== '' ? +maxPrice : null;

  const filter: SearchFilter = {
    checkInDate,
    checkOutDate,
    priceLimit,
    city
  }


  return Promise.all([
    api.find(filter),
    sdk.find(filter)
  ]).then((results) => {
    // мерджим все результаты в один
    const allResults: Place[] = [].concat(results[0] as never[], results[1] as never)
    return allResults.sort(sortByPriceAsc);
    // allResults.sort(sortByPrice)
  })
}


export async function search(evt: Event): Promise<void | Place[]> {
  evt.preventDefault();
  const city = (window.document.getElementById('city') as HTMLInputElement).value;
  const checkInDate = new Date((window.document.getElementById('check-in-date') as HTMLInputElement).value);
  const checkOutDate = new Date((window.document.getElementById('check-out-date') as HTMLInputElement).value);
  const maxPrice = (window.document.getElementById('max-price') as HTMLInputElement).value;
  const isApi = (window.document.getElementById('api') as HTMLInputElement).checked;
  const isSdk = (window.document.getElementById('sdk') as HTMLInputElement).checked;
  const priceLimit = maxPrice !== '' ? +maxPrice : null;
  if (!(isApi || isSdk)) {
    return renderToast(
      { text: 'Нужно выбрать один из источников поиска', type: 'error' },
      { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
    );
  }
  const filter: SearchFilter = {
    checkInDate,
    checkOutDate,
    priceLimit,
    city
  }
  if (isApi && !isSdk) {
    // const places = await findPlaces({ city, checkInDate, checkOutDate, priceLimit })
    // return places;
    return Promise.all([
      api.find(filter),
    ]).then((results) => {
      // мерджим все результаты в один
      return results[0].sort(sortByPriceAsc);
      // allResults.sort(sortByPrice)
    })
  }
  if (!isApi && isSdk) {
    // const SDK = new FlatRentSdk();
    // const places = await SDK.search({ city, checkInDate, checkOutDate, priceLimit }) as Promise<void|IPlace[]>
    // return places;
    return Promise.all([
      sdk.find(filter)
    ]).then((results) => {
      // мерджим все результаты в один
      return results[0].sort(sortByPriceAsc);
      // allResults.sort(sortByPrice)
    })
  }
  if(isApi && isSdk) {
    return Promise.all([
      api.find(filter),
      sdk.find(filter)
    ]).then((results) => {
      // мерджим все результаты в один
      const allResults: Place[] = [].concat(results[0] as never, results[1] as never)
      return allResults.sort(sortByPriceAsc);
      // allResults.sort(sortByPrice)
    })
  }
}
