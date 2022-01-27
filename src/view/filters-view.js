import AbstractView from './abstract-view.js';

const getTemplateFilters = (filters, currentFilterType) => {
  const fragment = [];
  filters.forEach((filter) => {
    const {type} = filter;
    fragment.push(`<div class="trip-filters__filter">
    <input id="filter-${type.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type.toLowerCase()}" ${type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type.toLowerCase()}">${type}</label>
  </div>`);
  });

  return fragment.join('');
};

const createFilters = (filters, currentFilterType) => (
  `<form class="trip-filters" action="#" method="get">
    ${getTemplateFilters(filters, currentFilterType)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilters(this.#filters, this.#currentFilterType);
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

