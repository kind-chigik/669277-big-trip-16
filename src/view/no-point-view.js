import {createElement} from '../render.js';

const createViewWithoutPoint = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

class NoPoints {
  #element = null;

  get template() {
    return createViewWithoutPoint();
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

export {NoPoints as default};


