import { renderBlock, renderToast } from './lib.js'

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
  const nextMonth = join(new Date, options, '-');

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
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
