import PointView from '../view/point-view.js';
import FormPointEditView from '../view/form-point-edit-view.js';
import {renderPosition, renderElement} from '../render.js';
import {isKeyEsс} from '../helper.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class PointPresentor {
  #elementPlace = null;
  #pointInstance = null;
  #pointEditInstace = null;
  #point = null;
  #updatePoint = null;
  #mode = Mode.DEFAULT;
  #changeMode = null;

  constructor(elementPlace, updatePoint, changeMode) {
    this.#elementPlace = elementPlace;
    this.#updatePoint = updatePoint;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointInstance = this.#pointInstance;
    const prevPointEditInstace = this.#pointEditInstace;

    this.#pointInstance = new PointView(point);
    this.#pointEditInstace = new FormPointEditView(point);

    this.#pointInstance.setListenerClickEdit(this.#openFormEdit);
    this.#pointInstance.setListenerClickFavorite(this.#changeFavorite);
    this.#pointEditInstace.setListenerClickClose(this.#closeFormEdit);
    this.#pointEditInstace.setListenerSubmit(this.#closeFormEdit);

    if (prevPointInstance === null || prevPointEditInstace === null) {
      renderElement(this.#elementPlace, this.#pointInstance, renderPosition.BEFOREEND);
    } else {
      this.#elementPlace.replaceChild(this.#pointInstance.element, prevPointInstance.element);
    }
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm = () => {
    this.#elementPlace.replaceChild(this.#pointEditInstace.element, this.#pointInstance.element);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint = () => {
    this.#elementPlace.replaceChild(this.#pointInstance.element, this.#pointEditInstace.element);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = (evt) => {
    if (isKeyEsс) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #openFormEdit = () => {
    this.#replacePointToForm();
  }

  #closeFormEdit = () => {
    this.#replaceFormToPoint();
  }

  #changeFavorite = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
    this.#updatePoint(this.#point);
  }
}

export {PointPresentor as default};
