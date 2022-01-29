import FilterView from '../view/filters-view.js';
import {TypeUpdate, TypeFilter} from '../const.js';
import {renderPosition, renderElement } from '../render';
import {removeInstance} from '../helper.js';

class FilterPresenter {
  #placeForRender = null;
  #filterModel = null;
  #filterInstance = null;

  constructor(placeForRender, filterModel) {
    this.#placeForRender = placeForRender;
    this.#filterModel = filterModel;
  }

  init = () => {
    const filters = this.filters;
    const prevFilterInstance = this.#filterInstance;

    this.#filterInstance = new FilterView(filters, this.#filterModel.filter);
    this.#filterInstance.setListenerChangeFilter(this.#changeFilterType);

    this.#filterModel.addObserver(this.#modelEvent);

    if (prevFilterInstance === null) {
      renderElement(this.#placeForRender, this.#filterInstance, renderPosition.BEFOREEND);
      return;
    }

    this.#placeForRender.replaceChild(this.#filterInstance.element, prevFilterInstance.element);
    removeInstance(prevFilterInstance);
  }

  get filters() {
    return [
      {
        type: TypeFilter.EVERYTHING,
      },
      {
        type: TypeFilter.FUTURE,
      },
      {
        type: TypeFilter.PAST,
      }
    ];
  }

  #changeFilterType = (currentFilterType) => {
    if (this.#filterModel.filter === currentFilterType) {
      return;
    }

    this.#filterModel.setFilter(TypeUpdate.MINOR, currentFilterType);
  }

  #modelEvent = () => {
    this.init();
  }

  destroy = () => {
    removeInstance(this.#filterInstance);
    this.#filterInstance = null;

    this.#filterModel.removeObserver(this.#modelEvent);

    this.#filterModel.setFilter(TypeUpdate.MINOR, TypeFilter.EVERYTHING);
  }
}

export {FilterPresenter as default};
