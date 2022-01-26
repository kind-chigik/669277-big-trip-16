import PointView from '../view/point-view.js';
import FormPointEditView from '../view/form-point-edit-view.js';
import {renderPosition, renderElement} from '../render.js';
import {isKeyEsс, removeInstance} from '../helper.js';
import {typesUpdate, userAction} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class PointPresentor {
  #elementPlace = null;
  #buttonAddNew = null;
  #pointInstance = null;
  #pointEditInstace = null;
  #point = null;
  #updatePoint = null;
  #mode = Mode.DEFAULT;
  #changeMode = null;
  #resetNewPoint = null;
  #isNewPoint = null;

  constructor(elementPlace, updatePoint, changeMode, resetNewPoint, buttonAddNew) {
    this.#elementPlace = elementPlace;
    this.#buttonAddNew = buttonAddNew;
    this.#updatePoint = updatePoint;
    this.#changeMode = changeMode;
    this.#resetNewPoint = resetNewPoint;
  }

  init = (point, isNewPoint) => {
    this.#point = point;
    this.#isNewPoint = isNewPoint;

    const prevPointInstance = this.#pointInstance;
    const prevPointEditInstace = this.#pointEditInstace;

    this.#pointInstance = new PointView(point);
    this.#pointEditInstace = new FormPointEditView(point);

    this.#pointInstance.setListenerClickEdit(this.#openFormEdit);
    this.#pointInstance.setListenerClickFavorite(this.#changeFavorite);
    this.#pointEditInstace.setListenerClickClose(this.#closeFormEdit);
    this.#pointEditInstace.setListenerSubmit(this.#savePoint);
    this.#pointEditInstace.setListenerDelete(this.#deletePoint);

    if (prevPointInstance === null || prevPointEditInstace === null) {
      renderElement(this.#elementPlace, this.#pointInstance, renderPosition.BEFOREEND);

      if (this.#isNewPoint) {
        this.replacePointToForm();
        this.#buttonAddNew.disabled = true;
      }
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      this.#elementPlace.replaceChild(this.#pointInstance.element, prevPointInstance.element);
    }

    if (this.#mode === Mode.EDITING) {
      this.#elementPlace.replaceChild(this.#pointEditInstace.element, prevPointEditInstace.element);
    }

    removeInstance(prevPointInstance);
    removeInstance(prevPointEditInstace);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditInstace.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  replacePointToForm = () => {
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
    if (isKeyEsс(evt)) {
      evt.preventDefault();
      if (this.#isNewPoint) {
        this.destroy();
        this.#resetNewPoint();
        this.#buttonAddNew.disabled = false;
        document.removeEventListener('keydown', this.#onEscKeyDown);
      } else {
        this.#pointEditInstace.reset(this.#point);
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#onEscKeyDown);
      }
    }
  }

  #openFormEdit = () => {
    this.replacePointToForm();
  }

  #closeFormEdit = () => {
    if (this.#isNewPoint) {
      this.destroy();
      this.#resetNewPoint();
      this.#buttonAddNew.disabled = false;
    } else {
      this.#pointEditInstace.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #savePoint = (update) => {
    if (this.#isNewPoint) {
      this.#updatePoint(userAction.ADD_POINT, typesUpdate.MAJOR, update);
      this.#isNewPoint = false;
      this.#buttonAddNew.disabled = false;
    }

    if ((String(this.#point.dateStart) !== String(update.dateStart)) || (String(this.#point.dateEnd) !== String(update.dateEnd))) {
      this.#updatePoint(userAction.UPDATE_POINT, typesUpdate.MINOR, update);
    } else {
      this.#updatePoint(userAction.UPDATE_POINT, typesUpdate.PATCH, update);
      this.#replaceFormToPoint();
    }
  };

  #deletePoint = (point) => {
    if (this.#isNewPoint) {
      this.destroy();
      this.#resetNewPoint();
      this.#buttonAddNew.disabled = false;
    } else {
      this.#updatePoint(userAction.DELETE_POINT, typesUpdate.MINOR, point);
    }
  }

  #changeFavorite = () => {
    this.#updatePoint(userAction.UPDATE_POINT, typesUpdate.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  }

  destroy = () => {
    if (this.#isNewPoint) {
      this.#buttonAddNew.disabled = false;
    }
    removeInstance(this.#pointInstance);
    removeInstance(this.#pointEditInstace);
  }
}

export {PointPresentor as default};
