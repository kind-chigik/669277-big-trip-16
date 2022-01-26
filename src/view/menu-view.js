import AbstractView from './abstract-view.js';
import {itemsMenu} from '../const.js';

const createMenu = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  ${itemsMenu.TABLE.toLowerCase()}" href="#">Table</a>
  <a class="trip-tabs__btn ${itemsMenu.STATS.toLowerCase()}" href="#">Stats</a>
  </nav>`
);

class MenuView extends AbstractView {
  #currentItemMenu = itemsMenu.TABLE;

  get template() {
    return createMenu();
  }

  setListenerClickMenu = (callback) => {
    this._callback.clickMenu = callback;
    this.element.addEventListener('click', this.#callActionClickMenu);
  }

  #callActionClickMenu = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.trip-tabs__btn')) {
      if (evt.target.textContent !== this.#currentItemMenu) {
        this._callback.clickMenu(evt.target.textContent);
      }
    }
  }

  setActiveMenuItem = (menuItem) => {
    const itemNotActive = this.element.querySelector(`.${menuItem.toLowerCase()}`);
    const itemActive = this.element.querySelector(`.${this.#currentItemMenu.toLowerCase()}`);

    if (menuItem !== this.#currentItemMenu) {
      itemNotActive.classList.add('trip-tabs__btn--active');
      itemActive.classList.remove('trip-tabs__btn--active');
    }

    this.#currentItemMenu = menuItem;
  }
}

export {MenuView as default};

