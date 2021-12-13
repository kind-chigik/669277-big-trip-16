import AbstractView from './abstract-view.js';

const createViewWithoutPoint = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

class NoPoints extends AbstractView {
  get template() {
    return createViewWithoutPoint();
  }
}

export {NoPoints as default};


