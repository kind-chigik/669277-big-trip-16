import {createElement} from '../render.js';
import {SHAKE_ANIMATION_TIMEOUT} from '../const.js';

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

  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

export {AbstractView as default};
