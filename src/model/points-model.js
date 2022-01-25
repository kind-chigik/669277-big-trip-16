import AbstractObservable from '../abstract-observable.js';

class PointsModel extends AbstractObservable {
  #points = [];

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = [...points];
  }

  updatePoint = (typeUpdate, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Нельзя обновить несуществующую точку');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(typeUpdate, update);
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
}

export {PointsModel as default};
