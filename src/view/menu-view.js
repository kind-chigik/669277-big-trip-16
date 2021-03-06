import AbstractView from './abstract-view.js';
import {ItemMenu} from '../const.js';

const createMenu = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  ${ItemMenu.TABLE.toLowerCase()}" href="#">Table</a>
  <a class="trip-tabs__btn ${ItemMenu.STATS.toLowerCase()}" href="#">Stats</a>
  </nav>`
);

class MenuView extends AbstractView {
  #currentItemMenu = ItemMenu.TABLE;

  get template() {
    return createMenu();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.trip-tabs__btn')) {
      if (evt.target.textContent !== this.#currentItemMenu) {
        this._callback.menuClick(evt.target.textContent);
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

