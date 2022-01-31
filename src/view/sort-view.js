import AbstractView from './abstract-view.js';
import {TypeSort} from '../const.js';

const createSort = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
  <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${currentSortType === TypeSort.BY_DAY ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-day">Day</label>
</div>

<div class="trip-sort__item  trip-sort__item--event">
  <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
  <label class="trip-sort__btn" for="sort-event">Event</label>
</div>

<div class="trip-sort__item  trip-sort__item--time">
  <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${currentSortType === TypeSort.BY_TIME ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-time">Time</label>
</div>

<div class="trip-sort__item  trip-sort__item--price">
  <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${currentSortType === TypeSort.BY_PRICE ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-price">Price</label>
</div>

<div class="trip-sort__item  trip-sort__item--offer">
  <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
  <label class="trip-sort__btn" for="sort-offer">Offers</label>
</div>
</form>`
);

class SortView extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
  }

  get template() {
    return createSort(this._currentSortType);
  }

  setSortClickHandler = (callback) => {
    this._callback.sortClick = callback;
    this.element.addEventListener('click', this.#sortClickHandler);
  }

  #sortClickHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.sortClick(evt.target.id);
  }
}

export {SortView as default};
