import {filterType} from './const.js';
import dayjs from 'dayjs';

const KEY_ESCAPE = 'Escape';
const KEY_ESC = 'Esc';
const idForOffers = {
  LUGGAGE: 'Add luggage',
  COMFORT: 'Switch to comfort class',
  MEAL: 'Add meal',
  SEATS: 'Choose seats',
  TRAIN: 'Travel by train',
  UBER: 'Order Uber',
  CAR: 'Rent a car',
  BREAKFAST: 'Add breakfast',
  TEACKETS: 'Book tickets',
  LUNCH: 'Lunch in city',
};

export const isKeyEsс = (evt) => evt.key === KEY_ESCAPE || evt.key === KEY_ESC;

export const durationEvent = (date1, date2) => dayjs(dayjs(date2).diff(dayjs(date1))).format('DD[D] HH[H] mm[M]');

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const removeInstance = (instance) => {
  if (instance === null) {
    return;
  }

  instance.element.remove();
  instance.removeElement();
};

export const createTextId = (string) => {
  let textId = '';
  switch (string) {
    case idForOffers.LUGGAGE:
      textId = 'luggage';
      return textId;
    case idForOffers.COMFORT:
      textId = 'comfort';
      return textId;
    case idForOffers.MEAL:
      textId = 'meal';
      return textId;
    case idForOffers.SEATS:
      textId = 'seats';
      return textId;
    case idForOffers.TRAIN:
      textId = 'train';
      return textId;
    case idForOffers.UBER:
      textId = 'uber';
      return textId;
    case idForOffers.CAR:
      textId = 'car';
      return textId;
    case idForOffers.BREAKFAST:
      textId = 'breakfast';
      return textId;
    case idForOffers.TEACKETS:
      textId = 'teackets';
      return textId;
    case idForOffers.LUNCH:
      textId = 'lunch';
      return textId;
  }
};

export const compareElementsByPrice = (element1, element2) => element2.price - element1.price;

export const compareElementsByTime = (element1, element2) => element2.durationEvent - element1.durationEvent;

export const compareElementsByDate = (element1, element2) => element1.dateStart - element2.dateStart;

export const filter = (currentFilterType, points) => {
  let filteredPoints = null;
  if (currentFilterType === filterType.EVERYTHING) {
    filteredPoints = points;
    return filteredPoints;
  }

  if (currentFilterType === filterType.FUTURE) {
    filteredPoints = points.filter((element) => element.dateStart >= dayjs().toDate());
    return filteredPoints;
  }

  if (currentFilterType === filterType.PAST) {
    filteredPoints = points.filter((element) => element.dateEnd <= dayjs().toDate());
    return filteredPoints;
  }
};

