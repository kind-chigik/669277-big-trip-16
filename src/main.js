import {renderPosition, renderElement} from './render.js';
import MenuView from './view/menu-view.js';
import StatisticsView from './view/statistics-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ApiService from './api-service.js';
import {generateZeroPoint} from './mock/point.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import {itemsMenu} from './const.js';
import {removeInstance} from './helper.js';

let zeroPoint = null;
let statisticsInstance = null;
const AUTHORIZATION = 'Basic ki32nf6e25gy6x1d';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel(apiService);

const navigation = document.querySelector('.trip-controls__navigation');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const buttonAddNew = document.querySelector('.trip-main__event-add-btn');
const main = document.querySelector('.trip-events');

const menuInstance = new MenuView();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filters, filterModel);
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

pointsModel.init().finally(() => {
  renderElement(navigation, menuInstance, renderPosition.BEFOREEND);
  menuInstance.setListenerClickMenu(clickMenu);
  filterPresenter.init();
});
