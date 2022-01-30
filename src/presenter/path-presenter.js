import PathView from '../view/path-view.js';
import {RenderPosition, renderElement} from '../render.js';
import {removeInstance} from '../helper.js';

class PathPresenter {
  #placeForRender = null;
  #pathInstance = null;
  #pointsModel = null;

  constructor(placeForRender, pointsModel) {
    this.#placeForRender = placeForRender;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    if (this.#pointsModel.points.length === 0) {
      if (this.#pathInstance) {
        this.destroy();
      }
      return;
    }
    const prevPathInstance = this.#pathInstance;
    this.#pathInstance = new PathView(this.#pointsModel.points);

    this.#pointsModel.addObserver(this.#modelEvent);

    if (prevPathInstance === null) {
      renderElement(this.#placeForRender, this.#pathInstance, RenderPosition.AFTERBEGIN);
      return;
    }

    this.#placeForRender.replaceChild(this.#pathInstance.element, prevPathInstance.element);
    removeInstance(prevPathInstance);
  }

  #modelEvent = () => {
    this.init();
  }

  destroy = () => {
    removeInstance(this.#pathInstance);
    this.#pointsModel.removeObserver(this.#modelEvent);
  }
}

export {PathPresenter as default};
