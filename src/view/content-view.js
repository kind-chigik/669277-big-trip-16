import AbstractView from './abstract-view.js';

const createContent = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class ContentView extends AbstractView {
  get template () {
    return createContent();
  }
}

export {ContentView as default};
