import FilterView from '../view/filters-view.js';
import {typesUpdate, filterType} from '../const.js';
import {renderPosition, renderElement } from '../render';
import {removeInstance} from '../helper.js';

class FilterPresenter {
  #placeForRender = null;
  #filterModel = null;
  #filterInstance = null;

  constructor(placeForRender, filterModel) {
    this.#placeForRender = placeForRender;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#modelEvent);
  }

  init = () => {
    const filters = this.filters;
    const prevFilterInstance = this.#filterInstance;

    this.#filterInstance = new FilterView(filters, this.#filterModel.filter);
    this.#filterInstance.setListenerChangeFilter(this.#changeFilterType);

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
        type: filterType.EVERYTHING,
        name: 'Everything',
      },
      {
        type: filterType.FUTURE,
        name: 'Future',
      },
      {
        type: filterType.PAST,
        name: 'Past',
      }
    ];
  }

  #changeFilterType = (currentFilterType) => {
    if (this.#filterModel.filter === currentFilterType) {
      return;
    }

    this.#filterModel.setFilter(typesUpdate.MINOR, currentFilterType);
  }

  #modelEvent = () => {
    this.init();
  }
}

export {FilterPresenter as default};
