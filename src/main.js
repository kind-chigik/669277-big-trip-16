import {renderTemplate, renderPosition} from './render.js';
import {createMenu} from './view/menu-view.js';
import {createFilters} from './view/filters-view.js';
import {createSort} from './view/sort-view.js';
import {createFormPoint} from './view/form-point-view.js';
import {createContent} from './view/content-view.js';
import {createPoint} from './view/point-view.js';

const POINT_COUNT = 3;

const navigation = document.querySelector('.trip-controls__navigation');
const filters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

renderTemplate(navigation, createMenu(), renderPosition.BEFOREEND);
renderTemplate(filters, createFilters(), renderPosition.BEFOREEND);
renderTemplate(tripEvents, createSort(), renderPosition.BEFOREEND);
renderTemplate(tripEvents, createContent(), renderPosition.BEFOREEND);

const content = tripEvents.querySelector('.trip-events__list');

renderTemplate(content, createPoint(), renderPosition.BEFOREEND);
renderTemplate(content, createFormPoint(), renderPosition.BEFOREEND);

for (let i = 0; i < POINT_COUNT; i++) {
  renderTemplate(content, createPoint(), renderPosition.BEFOREEND);
}

