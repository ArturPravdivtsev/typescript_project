import { renderBlock, renderToast } from './lib.js'
import { FlatRentSdk } from './flat-rent-sdk.js'
import { getPlaces, IPlace } from './search-results.js';

interface Parameters {
  city: string,
  checkInDate: Date,
  checkOutDate: Date,
  priceLimit: number|null
}

function join(t, a, s) {
  function format(m) {
    const f = new Intl.DateTimeFormat('en', m);
    return f.format(t);
  }
  return a.map(format).join(s);
}

function getLastDayOfMonth(year: number, month: number) {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
}

export function renderSearchFormBlock(checkInDate?: string, checkOutDate?: string) {
  const options = [{ year: 'numeric' }, { month: 'numeric' }, { day: 'numeric' }];
  const nextMonthDate = new Date();
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  nextMonthDate.setDate(getLastDayOfMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth()));
  const nextMonth = join(nextMonthDate, options, '-');

  if (checkInDate) {
    const dateNow = join(new Date, options, '-');
    if (dateNow < checkInDate) {
      renderToast(
        { text: 'Дата заезда не может быть меньше текущей даты!', type: 'error' },
        { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
      );
    }
  } else {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + 1);
    checkInDate = join(dateNow, options, '-');
  }

  if (checkOutDate) {
    if (checkOutDate > nextMonth) {
      renderToast(
        { text: 'Дата заезда не может быть меньше текущей даты!', type: 'error' },
        { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
      );
    }
  } else {
    const date = new Date(checkInDate);
    date.setDate(date.getDate() + 2);
    checkOutDate = join(date, options, '-');
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

function calculateDifferenceInDays(startDate, endDate) {
  const difference = endDate.getTime() - startDate.getTime()

  return Math.floor(difference / (1000 * 60 * 60 * 24))
}

function generateDateRange(from, to) {
  const dates = []
  const differenceInDays = calculateDifferenceInDays(from, to)

  dates.push(new Date(from.getFullYear(), from.getMonth(), from.getDate()))
  for (let i = 1; i <= differenceInDays; i++) {
    dates.push(new Date(from.getFullYear(), from.getMonth(), from.getDate() + i))
  }

  return dates
}

function areAllDatesAvailable(flat, dateRange) {
  return dateRange.every((date) => {
    return !flat.bookedDates.includes(date.getTime())
  })
}

async function findPlaces(parameters: Parameters):Promise<IPlace[]> {
  let places = await getPlaces();

  if (parameters.priceLimit != null) {
    places = places.filter((place) => {
      return place.price <= parameters.priceLimit
    })
  }

  const dateRange = generateDateRange(parameters.checkInDate, parameters.checkOutDate)
  places = places.filter((place) => {
    return areAllDatesAvailable(place, dateRange)
  })

  return places;
}

export async function search(e: Event): Promise<void | IPlace[]> {
  e.preventDefault();
  const city = (window.document.getElementById('city') as HTMLInputElement).value;
  const checkInDate = new Date((window.document.getElementById('check-in-date') as HTMLInputElement).value);
  const checkOutDate = new Date((window.document.getElementById('check-out-date') as HTMLInputElement).value);
  const maxPrice = (window.document.getElementById('max-price') as HTMLInputElement).value;
  const api = (window.document.getElementById('api') as HTMLInputElement).checked;
  const sdk = (window.document.getElementById('sdk') as HTMLInputElement).checked;
  const priceLimit = maxPrice !== '' ? +maxPrice : null;
  if (!(api || sdk)) {
    return renderToast(
      { text: 'Нужно выбрать один из источников поиска', type: 'error' },
      { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
    );
  }
  if (api && !sdk) {
    const places = await findPlaces({ city, checkInDate, checkOutDate, priceLimit })
    return places;
  }
  if (!api && sdk) {
    const SDK = new FlatRentSdk();
    const places = await SDK.search({ city, checkInDate, checkOutDate, priceLimit }) as Promise<void|IPlace[]>
    return places;
  }
  if(api && sdk) {
    const places = await findPlaces({ city, checkInDate, checkOutDate, priceLimit })
    const SDK = new FlatRentSdk();
    const sdkPlaces = await SDK.search({ city, checkInDate, checkOutDate, priceLimit }) as IPlace[]
    return places.concat(sdkPlaces);
  }
}
