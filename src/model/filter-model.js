import AbstractObservable from '../abstract-observable.js';
import {TypeFilter} from '../const.js';

class FilterModel extends AbstractObservable {
  #currentFilter = TypeFilter.EVERYTHING;

  get filter() {
    return this.#currentFilter;
  }

  setFilter = (updateType, filter) => {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  }

  resetFilter = () => {
    this.#currentFilter = TypeFilter.EVERYTHING;
  }
}

export {FilterModel as default};
