import {renderPosition, renderElement} from './render.js';
import MenuView from './view/menu-view.js';
import FilterView from './view/filters-view.js';
import {generatePoint} from './mock/point.js';
import TripPresenter from './presenter/trip-presenter.js';

const POINT_COUNT = 15;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const navigation = document.querySelector('.trip-controls__navigation');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const menuInstance = new MenuView();
const filterInstance = new FilterView();

renderElement(navigation, menuInstance, renderPosition.BEFOREEND);
renderElement(filters, filterInstance, renderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripEvents);
tripPresenter.init(points);

