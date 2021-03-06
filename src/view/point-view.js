import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {getDurationEvent} from '../helper.js';

const createOffers = (offersPoint) => {
  const fragments = [];
  offersPoint.forEach((offer) => {
    const {title, price} = offer;
    if (offer.checked === true) {
      fragments.push(`<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
      </li>`);
    }
  });
  return fragments.join('');
};

const isFavoritePoint = (value) => value === true ? 'event__favorite-btn--active' : '';

const createPoint = (point) => {
  const {dateStart, dateEnd, type, city, price, offers, isFavorite} = point;

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${dayjs(dateStart).format('D/MM/YY H:mm')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${city}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dayjs(dateStart).format('YY-MM-DTH:mm')}">${dayjs(dateStart).format('H:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${dayjs(dateEnd).format('YY-MM-DTH:mm')}">${dayjs(dateEnd).format('H:mm')}</time>
      </p>
      <p class="event__duration">${getDurationEvent(dateStart, dateEnd)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${createOffers(offers)}
    </ul>
    <button class="event__favorite-btn ${isFavoritePoint(isFavorite)}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

class PointView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createPoint(this.#point);
  }

  setButtonOpenClickHandler = (callback) => {
    this._callback.buttonOpenClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonOpenClickHandler);
  }

  setButtonFavoriteClickHandler = (callback) => {
    this._callback.buttonFavoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#buttonFavoriteClickHandler);
  }

  #buttonFavoriteClickHandler = () => {
    this._callback.buttonFavoriteClick();
  }

  #buttonOpenClickHandler = () => {
    this._callback.buttonOpenClick();
  }
}

export {PointView as default};
