import {createElement} from '../render.js';

const createMenu = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
  <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`
);

class MenuView {
  #element = null;

  get template() {
    return createMenu();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

export {MenuView as default};

