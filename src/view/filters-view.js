import AbstractView from './abstract-view.js';
import {TypeFilter} from '../const.js';

const isDisabled = (type, isFutureDisabled, isPastDisabled) => {
  if (type === TypeFilter.FUTURE) {
    if (isFutureDisabled) {
      return 'disabled';
    }
  }
  if (type === TypeFilter.PAST) {
    if (isPastDisabled) {
      return 'disabled';
    }
  }
};

const getTemplateFilters = (filters, currentFilterType, isFutureDisabled, isPastDisabled) => {
  const fragment = [];
  filters.forEach((filter) => {
    const {type} = filter;
    fragment.push(`<div class="trip-filters__filter">
    <input id="filter-${type.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type.toLowerCase()}" ${type === currentFilterType ? 'checked' : ''} ${isDisabled(type, isFutureDisabled, isPastDisabled)}>
    <label class="trip-filters__filter-label" for="filter-${type.toLowerCase()}">${type}</label>
  </div>`);
  });

  return fragment.join('');
};

const createFilters = (filters, currentFilterType, isFutureDisabled, isPastDisabled) => (
  `<form class="trip-filters" action="#" method="get">
    ${getTemplateFilters(filters, currentFilterType, isFutureDisabled, isPastDisabled)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #isFutureDisabled = null;
  #isPastDisabled = null;

  constructor(filters, currentFilterType, isFutureDisabled, isPastDisabled) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#isFutureDisabled = isFutureDisabled;
    this.#isPastDisabled = isPastDisabled;
  }

  get template() {
    return createFilters(this.#filters, this.#currentFilterType, this.#isFutureDisabled, this.#isPastDisabled);
  }

  setListenerChangeFilter = (callback) => {
    this._callback.changeFilter = callback;
    this.element.addEventListener('click', this.#callActionChangeFilter);
  }

  #callActionChangeFilter = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.trip-filters__filter-label')) {
      this._callback.changeFilter(evt.target.textContent);
    }
  }
}

export {FilterView as default};

