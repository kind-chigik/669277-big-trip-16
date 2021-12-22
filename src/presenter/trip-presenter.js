import NoPoints from '../view/no-point-view.js';
import SortView from '../view/sort-view.js';
import ContentView from '../view/content-view.js';
import PointPresentor from '../presenter/point-presenter.js';
import {renderPosition, renderElement} from '../render.js';
import {updateItem, compareElementByPrice, compareElementByTime, compareElementByDate} from '../helper.js';
import dayjs from 'dayjs';

const typesSort = {
  BY_DEFAULT: 'sort-day',
  BY_PRICE: 'sort-price',
  BY_TIME: 'sort-time',
};

class TripPresenter {
  #placeForRender = null;
  #points = [];
  #sourcePoints = [];
  #pointsPresenters = new Map();

  #noPointsInstance = new NoPoints();
  #sortInstance = new SortView();
  #contentInstance = new ContentView();

  constructor(placeForRender) {
    this.#placeForRender = placeForRender;
  }

  init = (points) => {
    this.#sourcePoints = [...points];
    this.#points = [...points];
    this.#points.sort(compareElementByDate);
    this.#renderPoints();
  }

  #changeMode = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  }

  #sortPoints = (typeSort) => {
    switch (typeSort) {
      case typesSort.BY_PRICE:
        this.#points.sort(compareElementByPrice);
        break;
      case typesSort.BY_TIME:
        this.#points.forEach((point) => {
          point.durationEvent = dayjs(dayjs(point.dateEnd).diff(dayjs(point.dateStart)));
        });
        this.#points.sort(compareElementByTime);
        break;
      default:
        this.#points.sort(compareElementByDate);
    }
    this.#clearPointsList();
    this.#renderPoints();
  }

  #renderSort = () => {
    renderElement(this.#placeForRender, this.#sortInstance, renderPosition.BEFOREEND);
    this.#sortInstance.setListenerClickSort(this.#sortPoints);
  }

  #updatePoint = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  #renderPoint = (elementPlace, point) => {
    const pointPresenter = new PointPresentor(elementPlace, this.#updatePoint, this.#changeMode);
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    if (this.#points.length === 0) {
      renderElement(this.#placeForRender, this.#noPointsInstance, renderPosition.BEFOREEND);
    } else {
      this.#renderSort();
      renderElement(this.#placeForRender, this.#contentInstance, renderPosition.BEFOREEND);

      const content = this.#placeForRender.querySelector('.trip-events__list');

      for (const point of this.#points) {
        this.#renderPoint(content, point);
      }
    }
  }

  #clearPointsList = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }
}

export {TripPresenter as default};
