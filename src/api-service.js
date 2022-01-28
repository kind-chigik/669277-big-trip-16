const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get points() {
    return this.#load({url: 'points'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this.#load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  get offers() {
    return this.#load({url: 'offers'}).then(ApiService.parseResponse);
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  updatePoint = async (point) => {
    const response = await this.#load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'is_favorite': point.isFavorite,
      'base_price': Number(point.price),
      'date_from': point.dateStart.toISOString(),
      'date_to': point.dateEnd.toISOString(),
      'destination': {
        description: point.destination.description,
        name: point.city,
        pictures: point.destination.photos,
      },
    };

    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;
    delete adaptedPoint.dateStart;
    delete adaptedPoint.dateEnd;
    delete adaptedPoint.city;

    return adaptedPoint;
  }
}

export {ApiService as default};
