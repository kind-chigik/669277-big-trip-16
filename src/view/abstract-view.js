import {createElement} from '../render.js';

class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Нельзя создавать экземпляр абстрактного класса');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Абстрактный метод не имплементирован: get template');
  }

  removeElement() {
    this.#element = null;
  }
}

export {AbstractView as default};
