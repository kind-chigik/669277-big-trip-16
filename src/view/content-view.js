import {createElement} from '../render.js';

const createContent = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class ContentView {
  #element = null;

  get template () {
    return createContent();
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

export {ContentView as default};
