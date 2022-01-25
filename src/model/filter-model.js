import AbstractObservable from '../abstract-observable.js';
import {filterType} from '../const.js';

class FilterModel extends AbstractObservable {
  #currentFilter = filterType.EVERYTHING;

  get filter() {
    return this.#currentFilter;
  }

  setFilter = (updateType, filter) => {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  }

  resetFilter = () => {
    this.#currentFilter = filterType.EVERYTHING;
  }
}

export {FilterModel as default};
