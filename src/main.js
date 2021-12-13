import {renderPosition, renderElement} from './render.js';
import MenuView from './view/menu-view.js';
import FilterView from './view/filters-view.js';
import ContentView from './view/content-view.js';
import SortView from './view/sort-view.js';
import PointView from './view/point-view.js';
import FormPointEditView from './view/form-point-edit-view.js';
import NoPoints from './view/no-point-view.js';
import {generatePoint} from './mock/point.js';
import {isKeyEsс} from './helper.js';

const POINT_COUNT = 15;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const renderPoints = (elementPlace, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new FormPointEditView(point);

  const replacePointToForm = () => {
    elementPlace.replaceChild(pointEditComponent.element, pointComponent.element);
  };

  const replaceFormToPoint = () => {
    elementPlace.replaceChild(pointComponent.element, pointEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (isKeyEsс) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setListenerClickEdit(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setListenerSubmit(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setListenerClickClose(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  return renderElement(elementPlace, pointComponent, renderPosition.BEFOREEND);
};

const navigation = document.querySelector('.trip-controls__navigation');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const menuInstance = new MenuView();
const filterInstance = new FilterView();
const noPointsInstance = new NoPoints();
const sortInstance = new SortView();
const contentInstance = new ContentView();

renderElement(navigation, menuInstance, renderPosition.BEFOREEND);
renderElement(filters, filterInstance, renderPosition.BEFOREEND);

if (points.length === 0) {
  renderElement(tripEvents, noPointsInstance, renderPosition.BEFOREEND);
} else {
  renderElement(tripEvents, sortInstance, renderPosition.BEFOREEND);
  renderElement(tripEvents, contentInstance, renderPosition.BEFOREEND);

  const content = tripEvents.querySelector('.trip-events__list');

  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoints(content, points[i]);
  }
}
