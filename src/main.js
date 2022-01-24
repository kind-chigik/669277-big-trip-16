import {renderPosition, renderElement} from './render.js';
import MenuView from './view/menu-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {generatePoint} from './mock/point.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const POINT_COUNT = 15;

const points = Array.from({length: POINT_COUNT}, generatePoint);
const pointsModel = new PointsModel();

pointsModel.points = points;

const navigation = document.querySelector('.trip-controls__navigation');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const buttonAddNew = document.querySelector('.trip-main__event-add-btn');

const menuInstance = new MenuView();

renderElement(navigation, menuInstance, renderPosition.BEFOREEND);
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filters, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(tripEvents, pointsModel, buttonAddNew, filterModel);
tripPresenter.init();

