import NoPoints from '../view/no-point-view.js';
import SortView from '../view/sort-view.js';
import ContentView from '../view/content-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresentor from '../presenter/point-presenter.js';
import {renderPosition, renderElement} from '../render.js';
import {compareElementsByPrice, compareElementsByTime, compareElementsByDate, filter, removeInstance} from '../helper.js';
import {typesSort, typesUpdate, userAction} from '../const.js';
import dayjs from 'dayjs';

class TripPresenter {
  #placeForRender = null;
  #buttonAddNew = null;
  #zeroPoint = null;
  #pointsPresenters = new Map();
  #currentSortType = null;
  #noPointsInstance = null;
  #contentInstance = new ContentView();
  #loadingInstance = new LoadingView();
  #sortInstance = null;
  #pointsModel = null;
  #filterModel = null;
  #isLoading = true;

  constructor(placeForRender, pointsModel, buttonAddNew, filterModel) {
    this.#placeForRender = placeForRender;
    this.#pointsModel = pointsModel;  // Модель точек
    this.#filterModel = filterModel;
    this.#buttonAddNew = buttonAddNew;
    this.#currentSortType = typesSort.BY_DAY;
  }

  init = (zeroPoint) => {
    this.#zeroPoint = zeroPoint;
    this.#renderPoints();

    this.#pointsModel.addObserver(this.#modelEvent);
    this.#filterModel.addObserver(this.#modelEvent);
  }

  get points() {
    this.currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter(this.currentFilterType, points);

    switch (this.#currentSortType) {
      case typesSort.BY_PRICE:
        return  filteredPoints.sort(compareElementsByPrice);
      case typesSort.BY_TIME:
        this.#pointsModel.points.forEach((point) => {
          point.durationEvent = dayjs(dayjs(point.dateEnd).diff(dayjs(point.dateStart)));
        });
        return filteredPoints.sort(compareElementsByTime);
      case typesSort.BY_DAY:
        return filteredPoints.sort(compareElementsByDate);
    }

    return filteredPoints;
  }

  #changeMode = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  }

  #sortPoints = (typeSort) => {
    if (typeSort === this.#currentSortType) {
      return;
    }

    this.#currentSortType = typeSort;

    this.#clearPointsList();
    this.#renderPoints();
  }

  #renderSort = () => {
    this.#sortInstance = new SortView(this.#currentSortType);
    this.#sortInstance.setListenerClickSort(this.#sortPoints);

    renderElement(this.#placeForRender, this.#sortInstance, renderPosition.BEFOREEND);
  }

  #viewEvent = (typeAction, typeUpdate, update) => {
    switch (typeAction) {
      case userAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(typeUpdate, update);
        break;
      case userAction.ADD_POINT:
        this.#pointsModel.addPoint(typeUpdate, update);
        break;
      case userAction.DELETE_POINT:
        this.#pointsModel.deletePoint(typeUpdate, update);
    }
  }

  #modelEvent = (typeUpdate, data) => {
    switch (typeUpdate) {
      case typesUpdate.PATCH:
        this.#pointsPresenters.get(data.id).init(data, null, this.#pointsModel.destinations, this.#pointsModel.offers);
        break;
      case typesUpdate.MINOR:
        this.#clearPointsList();
        this.#renderPoints();
        break;
      case typesUpdate.MAJOR:
        this.#clearPointsList({resetSort: true, resetFilter: true});
        this.#renderPoints();
        break;
      case typesUpdate.INIT:    // запустится только после того, как модель загрузит все данные
        this.#isLoading = false;
        removeInstance(this.#loadingInstance);
        this.#renderPoints();
    }
  }

  #resetNewPoint = () => {
    this.#clearPointsList();
    this.#renderPoints();
  }

  #renderPoint = (elementPlace, point) => {
    if (this.#zeroPoint) {
      const pointPresenter = new PointPresentor(elementPlace, this.#viewEvent, this.#changeMode, this.#resetNewPoint, this.#buttonAddNew);
      pointPresenter.init(point, Boolean(this.#zeroPoint), this.#pointsModel.destinations, this.#pointsModel.offers);
      this.#pointsPresenters.set(point.id, pointPresenter);
      this.#zeroPoint = null;
    } else {
      const pointPresenter = new PointPresentor(elementPlace, this.#viewEvent, this.#changeMode);
      pointPresenter.init(point, null, this.#pointsModel.destinations, this.#pointsModel.offers);
      this.#pointsPresenters.set(point.id, pointPresenter);
    }
  }

  #renderPoints = () => {
    if (this.#isLoading) {
      this.#buttonAddNew.disabled = true;
      renderElement(this.#placeForRender, this.#loadingInstance, renderPosition.AFTERBEGIN);
      return;
    } else {
      this.#buttonAddNew.disabled = false;
    }

    if (this.points.length === 0) {
      this.#noPointsInstance = new NoPoints(this.currentFilterType);
      renderElement(this.#placeForRender, this.#noPointsInstance, renderPosition.BEFOREEND);
    } else {
      this.#renderSort();
      renderElement(this.#placeForRender, this.#contentInstance, renderPosition.BEFOREEND);

      const content = this.#placeForRender.querySelector('.trip-events__list');

      if (this.#zeroPoint) {
        this.#renderPoint(content, this.#zeroPoint);
      }

      for (const point of this.points) {
        this.#renderPoint(content, point);
      }
    }
  }

  #clearPointsList = ({resetSort = false, resetFilter = false} = {}) => {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    if (this.#noPointsInstance) {
      removeInstance(this.#noPointsInstance);
    }

    if (resetFilter) {
      this.#filterModel.resetFilter();
    }

    if (resetSort) {
      this.#currentSortType = typesSort.BY_DAY;
    }
    removeInstance(this.#sortInstance);
    removeInstance(this.#loadingInstance);
  }

  destroy = () => {
    this.#clearPointsList({resetSort: true, resetFilter: true});
    removeInstance(this.#contentInstance);

    this.#pointsModel.removeObserver(this.#modelEvent);
    this.#filterModel.removeObserver(this.#modelEvent);

  }
}

export {TripPresenter as default};
