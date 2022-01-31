import {TypeFilter, KeyEsc, typesPoints} from './const.js';
import dayjs from 'dayjs';

export const isKeyEsc = (evt) => evt.key === KeyEsc.KEY_ESCAPE || evt.key === KeyEsc.KEY_ESC;

export const getDurationEvent = (date1, date2) => dayjs(dayjs(date2).diff(dayjs(date1))).format('DD[D] HH[H] mm[M]');

export const removeInstance = (instance) => {
  if (instance === null) {
    return;
  }

  instance.element.remove();
  instance.removeElement();
};

export const compareElementsByPrice = (element1, element2) => element2.price - element1.price;

export const compareElementsByTime = (element1, element2) => element2.durationEvent - element1.durationEvent;

export const compareElementsByDate = (element1, element2) => element1.dateStart - element2.dateStart;

export const filter = (currentFilterType, points) => {
  let filteredPoints = null;
  if (currentFilterType === TypeFilter.EVERYTHING) {
    filteredPoints = points;
    return filteredPoints;
  }

  if (currentFilterType === TypeFilter.FUTURE) {
    filteredPoints = points.filter((element) => element.dateStart >= dayjs().toDate());
    return filteredPoints;
  }

  if (currentFilterType === TypeFilter.PAST) {
    filteredPoints = points.filter((element) => element.dateEnd <= dayjs().toDate());
    return filteredPoints;
  }
};

const getRandomNumber = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElement = (elements) => {
  const randomIndex = getRandomNumber(0, elements.length - 1);

  return elements[randomIndex];
};

export const generateZeroPoint = (offersPoint) => {
  const type = getRandomElement(typesPoints);

  let offers = null;
  if (offersPoint) {
    offersPoint.forEach((element) => {
      if (element.type === type.toLowerCase()) {
        offers = element.offers;
      }
    });
  }

  return {
    id: '',
    type,
    city: '',
    destination: {
      description: '',
      photos: '',
    },
    dateStart: '',
    dateEnd: '',
    price: '',
    isFavorite: false,
    offers,
  };
};
