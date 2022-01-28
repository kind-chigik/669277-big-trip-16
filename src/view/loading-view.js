import AbstractView from './abstract-view.js';

const createTemplateLoading = () => (
  `<p class="trip-events__msg">
  Loading...
  </p>`
);

class LoadingView extends AbstractView {
  get template() {
    return createTemplateLoading();
  }
}

export {LoadingView as default};
