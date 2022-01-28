import AbstractObservable from '../abstract-observable.js';
import {typesUpdate} from '../const.js';

class PointsModel extends AbstractObservable {
  #points = [];
  #destinations = [];
  #offers = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#destinations = await this.#apiService.destinations;
      this.#offers = await this.#apiService.offers;
    }

    catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(typesUpdate.INIT);
  }

  updatePoint = async (typeUpdate, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Нельзя обновить несуществующую точку');
    }

    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(typeUpdate, updatedPoint);
    } catch(err) {
      throw new Error('Не получилось обновить точку');
    }
  }

  addPoint = (typeUpdate, update) => {
    this.#points = [update, ...this.#points];

    this._notify(typeUpdate, update);
  }

  deletePoint = (typeUpdate, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Нельзя удалить несуществующую точку');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(typeUpdate);
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      isFavorite: point.is_favorite,
      price: point.base_price,
      dateStart: new Date(point.date_from),
      dateEnd: new Date(point.date_to),
      city: point.destination.name,
      destination: {
        description: point.destination.description,
        photos: point.destination.pictures,
      }
    };

    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;

    return adaptedPoint;
  }
}

export {PointsModel as default};
