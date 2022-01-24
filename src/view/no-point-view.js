import AbstractView from './abstract-view.js';
import {filterType} from '../const.js';

const textForNoPoint = {
  [filterType.EVERYTHING]: 'Click New Event to create your first point',
  [filterType.FUTURE]: 'There are no future events now',
  [filterType.PAST]: 'There are no past events now',
};

const createViewWithoutPoint = (filter) => {
  const text = textForNoPoint[filter];

  return `<p class="trip-events__msg">${text}</p>`;
};

class NoPoints extends AbstractView {
  constructor(filter) {
    super();
    this._filterType = filter;
  }

  get template() {
    return createViewWithoutPoint(this._filterType);
  }
}

export {NoPoints as default};


