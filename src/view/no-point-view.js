import AbstractView from './abstract-view.js';
import {TypeFilter} from '../const.js';

const textForNoPoint = {
  [TypeFilter.EVERYTHING]: 'Click New Event to create your first point',
  [TypeFilter.FUTURE]: 'There are no future events now',
  [TypeFilter.PAST]: 'There are no past events now',
};

const createViewWithoutPoint = (filter) => {
  const text = textForNoPoint[filter];

  return `<p class="trip-events__msg">${text}</p>`;
};

class NoPointView extends AbstractView {
  constructor(filter) {
    super();
    this._filterType = filter;
  }

  get template() {
    return createViewWithoutPoint(this._filterType);
  }
}

export {NoPointView as default};


