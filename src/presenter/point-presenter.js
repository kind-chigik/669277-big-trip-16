import PointView from '../view/point-view.js';
import FormPointEditView from '../view/form-point-edit-view.js';
import {RenderPosition, renderElement} from '../render.js';
import {isKeyEsc, removeInstance} from '../helper.js';
import {TypeUpdate, UserAction, ConditionView} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class PointPresenter {
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

  init = (point, isNewPoint, destinations, offers) => {
    this.#point = point;
    this.#isNewPoint = isNewPoint;

    const prevPointInstance = this.#pointInstance;
    const prevPointEditInstace = this.#pointEditInstace;

    this.#pointInstance = new PointView(point);
    this.#pointEditInstace = new FormPointEditView(point, destinations, offers);

    this.#pointInstance.setButtonOpenClickHandler(this.#handleButtonOpenClick);
    this.#pointInstance.setButtonFavoriteClickHandler(this.#handleButtonFavoriteClick);
    this.#pointEditInstace.setButtonCloseClickHandler(this.#handleButtonCloseClick);
    this.#pointEditInstace.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditInstace.setButtomDeleteClickHandler(this.#handleButtomDeleteClick);

    if (prevPointInstance === null || prevPointEditInstace === null) {
      renderElement(this.#elementPlace, this.#pointInstance, RenderPosition.BEFOREEND);

      if (this.#isNewPoint) {
        this.#replacePointToForm();
        this.#buttonAddNew.disabled = true;
      }
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      this.#elementPlace.replaceChild(this.#pointInstance.element, prevPointInstance.element);
    }

    if (this.#mode === Mode.EDITING) {
      this.#elementPlace.replaceChild(this.#pointInstance.element, prevPointEditInstace.element);
      this.#mode = Mode.DEFAULT;
    }

    removeInstance(prevPointInstance);
    removeInstance(prevPointEditInstace);
  }

  resetView = () => {
    if (this.#isNewPoint) {
      this.destroy();
      this.#resetNewPoint();
      this.#buttonAddNew.disabled = false;
      return;
    }
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditInstace.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  setViewCondition = (condition) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetConditions = () => {
      this.#pointEditInstace.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (condition) {
      case ConditionView.SAVING:
        this.#pointEditInstace.updateData(
          {
            isDisabled: true,
            isSaving: true,
          }
        );
        break;
      case ConditionView.DELETING:
        this.#pointEditInstace.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case ConditionView.ABORTING:
        this.#pointInstance.shake(resetConditions);
        this.#pointEditInstace.shake(resetConditions);
        break;
    }
  }

  destroy = () => {
    if (this.#isNewPoint) {
      this.#buttonAddNew.disabled = false;
    }
    removeInstance(this.#pointInstance);
    removeInstance(this.#pointEditInstace);
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
    if (isKeyEsc(evt)) {
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

  #handleButtonOpenClick = () => {
    this.#replacePointToForm();
  }

  #handleButtonCloseClick = () => {
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

  #handleFormSubmit = (update) => {
    if (this.#isNewPoint) {
      this.#updatePoint(UserAction.ADD_POINT, TypeUpdate.MAJOR, update);
      this.#isNewPoint = false;
      this.#buttonAddNew.disabled = false;
      document.removeEventListener('keydown', this.#onEscKeyDown);
      return;
    }

    if ((String(this.#point.dateStart) !== String(update.dateStart)) || (String(this.#point.dateEnd) !== String(update.dateEnd))) {
      this.#updatePoint(UserAction.UPDATE_POINT, TypeUpdate.MINOR, update);
      document.removeEventListener('keydown', this.#onEscKeyDown);
    } else {
      this.#updatePoint(UserAction.UPDATE_POINT, TypeUpdate.PATCH, update);
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleButtomDeleteClick = (point) => {
    if (this.#isNewPoint) {
      this.destroy();
      this.#resetNewPoint();
    } else {
      this.#updatePoint(UserAction.DELETE_POINT, TypeUpdate.MINOR, point);
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #handleButtonFavoriteClick = () => {
    this.#updatePoint(UserAction.UPDATE_POINT, TypeUpdate.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  }
}

export {PointPresenter as default};
