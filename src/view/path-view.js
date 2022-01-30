import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import {compareElementsByDate} from '../helper.js';

const getTotalPrice = (points) => {
  let totalPrice = 0;
  points.forEach((point) => {
    let pricePoint = 0;
    let priceOffers = 0;
    if (point.offers.length !== 0) {
      const checkedOffers = point.offers.filter((offer) => offer.checked === true);
      checkedOffers.forEach((offer) => {
        priceOffers += offer.price;
      });
    }
    pricePoint = point.price + priceOffers;
    totalPrice += pricePoint;
  });
  return totalPrice;
};

const createPath = (points) => {
  const sortedPoints = points.sort(compareElementsByDate);
  const isPointTwoExist = Boolean(sortedPoints[1]);
  const isPointThreeExist = Boolean(sortedPoints[2]);
  if (points.length <= 3) {
    return   `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${sortedPoints[0].city} ${isPointTwoExist ? sortedPoints[1].city : ''} ${isPointThreeExist ? sortedPoints[2].city : ''}</h1>
  
      <p class="trip-info__dates">${dayjs(points[0].dateStart).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(sortedPoints[sortedPoints.length-1].dateEnd).format('MMM DD')}</p>
    </div>
  
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(points)}</span>
    </p>
    </section>`;
  }

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${sortedPoints[0].city} ... ${sortedPoints[sortedPoints.length-1].city}</h1>

    <p class="trip-info__dates">${dayjs(points[0].dateStart).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(sortedPoints[sortedPoints.length-1].dateEnd).format('MMM DD')}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(points)}</span>
  </p>
  </section>`;
};

class PathView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createPath(this.#points);
  }
}

export {PathView as default};
