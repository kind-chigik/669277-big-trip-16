import {renderPosition, renderElement} from './render.js';
import MenuView from './view/menu-view.js';
import StatisticsView from './view/statistics-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {generatePoint, generateZeroPoint} from './mock/point.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import {itemsMenu} from './const.js';
import {removeInstance} from './helper.js';

const POINT_COUNT = 3;
let zeroPoint = null;

const points = Array.from({length: POINT_COUNT}, generatePoint);
const pointsModel = new PointsModel();

pointsModel.points = points;

const navigation = document.querySelector('.trip-controls__navigation');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const buttonAddNew = document.querySelector('.trip-main__event-add-btn');
const main = document.querySelector('.trip-events');

const menuInstance = new MenuView();
renderElement(navigation, menuInstance, renderPosition.BEFOREEND);

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filters, filterModel);
filterPresenter.init();

let statisticsInstance = null;

const tripPresenter = new TripPresenter(tripEvents, pointsModel, buttonAddNew, filterModel);
tripPresenter.init();

const clickMenu = (itemMenu) => {
  switch (itemMenu) {
    case itemsMenu.STATS:
      menuInstance.setActiveMenuItem(itemMenu);
      filterPresenter.destroy();
      tripPresenter.destroy();
      statisticsInstance = new StatisticsView(pointsModel.points);
      renderElement(main, statisticsInstance, renderPosition.BEFOREEND);
      break;
    case itemsMenu.TABLE:
      menuInstance.setActiveMenuItem(itemMenu);
      filterPresenter.init();
      tripPresenter.init();
      removeInstance(statisticsInstance);
      break;
  }
};

menuInstance.setListenerClickMenu(clickMenu);

const addNewPoint = () => {
  zeroPoint = generateZeroPoint();
  if (statisticsInstance) {
    removeInstance(statisticsInstance);
    filterPresenter.init();
    tripPresenter.destroy();
    tripPresenter.init(zeroPoint);
    menuInstance.setActiveMenuItem(itemsMenu.TABLE);
    return;
  }

  tripPresenter.destroy();
  tripPresenter.init(zeroPoint);
};

buttonAddNew.addEventListener('click', addNewPoint);
