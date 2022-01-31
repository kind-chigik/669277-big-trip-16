import FilterView from '../view/filters-view.js';
import {TypeUpdate, TypeFilter} from '../const.js';
import {RenderPosition, renderElement } from '../render';
import {removeInstance} from '../helper.js';
import dayjs from 'dayjs';

class FilterPresenter {
  #placeForRender = null;
  #filterModel = null;
  #pointsModel = null;
  #filterInstance = null;
  #isFutureDisabled = null;
  #isPastDisabled = null;

  constructor(placeForRender, filterModel, pointsModel) {
    this.#placeForRender = placeForRender;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    const filters = this.filters;
    const prevFilterInstance = this.#filterInstance;

    this.#isFutureDisabled = this.#pointsModel.points.filter((point) => point.dateStart > dayjs()).length === 0;
    this.#isPastDisabled = this.#pointsModel.points.filter((point) => point.dateEnd < dayjs()).length === 0;

    this.#filterInstance = new FilterView(filters, this.#filterModel.filter, this.#isFutureDisabled, this.#isPastDisabled);
    this.#filterInstance.setListenerChangeFilter(this.#changeFilterType);

    this.#filterModel.addObserver(this.#modelEvent);
    this.#pointsModel.addObserver(this.#modelEvent);

    if (prevFilterInstance === null) {
      renderElement(this.#placeForRender, this.#filterInstance, RenderPosition.BEFOREEND);
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

    if (TypeFilter.PAST === currentFilterType && this.#isPastDisabled) {
      return;
    }

    if (TypeFilter.FUTURE === currentFilterType && this.#isFutureDisabled) {
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
