import NoPoints from '../view/no-point-view.js';
import SortView from '../view/sort-view.js';
import ContentView from '../view/content-view.js';
import PointPresentor from '../presenter/point-presenter.js';
import {renderPosition, renderElement} from '../render.js';
import {updateItem} from '../helper.js';

class TripPresenter {
  #placeForRender = null;
  #points = [];
  #pointsPresenters = new Map();

  #noPointsInstance = new NoPoints();
  #sortInstance = new SortView();
  #contentInstance = new ContentView();

  constructor(placeForRender) {
    this.#placeForRender = placeForRender;
  }

  init = (points) => {
    this.#points = [...points];
    this.#renderPoints();
  }

  #updatePoint = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  #changeMode = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
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
      renderElement(this.#placeForRender, this.#sortInstance, renderPosition.BEFOREEND);
      renderElement(this.#placeForRender, this.#contentInstance, renderPosition.BEFOREEND);

      const content = this.#placeForRender.querySelector('.trip-events__list');

      for (let i = 0; i < this.#points.length; i++) {
        this.#renderPoint(content, this.#points[i]);
      }
    }
  }
}

export {TripPresenter as default};
