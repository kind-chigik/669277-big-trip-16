import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {createTextId} from '../helper.js';
import {reForPrice} from '../const.js';

const createOffers = (offersPoint) => {
  const fragment = [];
  offersPoint.forEach((offer) => {
    const {title, cost, checked} = offer;
    const inputId = createTextId(title);
    fragment.push(`<div class="event__available-offers">
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${inputId}-1" type="checkbox" name="event-offer-${inputId}" value="${title}" ${checked === true ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${inputId}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${cost}</span>
      </label>
    </div>`);
  });

  return fragment.join('');
};

const createPhotos = (photosPoint) => {
  if (photosPoint) {
    const fragment = [];
    photosPoint.forEach((photo) => {
      fragment.push(`<img class="event__photo" src="${photo}" alt="Event photo">`);
    });

    return fragment.join('');
  }
};

const createTypesPoints = (typesPoints, checkedType) => {
  const fragment = [];
  typesPoints.forEach((element) => {
    const {type} = element;
    fragment.push(`<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${type === checkedType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
  </div>
    `);
  });

  return fragment.join('');
};

const createCities = (destinationForCities) => {
  const fragment = [];
  destinationForCities.forEach((element) => {
    fragment.push(`<option value="${element.city}"></option>`);
  });

  return fragment.join('');
};

const createFormPointEdit = (pointWithConditions, originCity) => {
  const {type, city, dateStart, dateEnd, price, offers, destination, destinationForCities, randomOffers} = pointWithConditions;
  const {description, photos} = destination;
  const isPointHasDescription = description === '' && photos.length === 0 ? 'visually-hidden' : '';
  const isPointHasOffers = offers.length === 0 ? 'visually-hidden' : '';
  const isPointNew = originCity === '';
  const isSaveDisabled = (city === '') || (dateStart === '') || (dateEnd === '') ? 'disabled' : '';

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type ? type.toLowerCase() : ''}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypesPoints(randomOffers, type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city ? city : ''}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createCities(destinationForCities)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaveDisabled}>Save</button>
      <button class="event__reset-btn" type="reset">${isPointNew ? 'Cancel' : 'Delete'}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
    <section class="event__section  event__section--offers ${isPointHasOffers}">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  ${createOffers(offers)}
  </section>

      <section class="event__section  event__section--destination ${isPointHasDescription}">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
        <div class="event__photos-tape">
        ${createPhotos(photos)}
        </div>
      </div>
      </section>
    </section>
  </form>
</li>`;
};

class FormPointEditView extends SmartView {
  #point = null;
  #datepickerDateStart = null;
  #datepickerDateEnd = null;

  constructor(point) {
    super();
    this.#point = point;
    this._condiotions = FormPointEditView.parsePointToConditions(point);

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createFormPointEdit(this._condiotions, this.#point.city);
  }

  setListenerSubmit = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#callActionSubmit);
  }

  setListenerClickClose = (callback) => {
    this._callback.clickClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#callActionClickClose);
  }

  setListenerDelete = (callback) => {
    this._callback.delete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#callActionDelete);
  }

  #callActionSubmit = (evt) => {
    evt.preventDefault();
    this._callback.submit(FormPointEditView.parseConditionsToPoint(this._condiotions));
  }

  #callActionClickClose = () => {
    this._callback.clickClose();
  }

  #callActionDelete = () => {
    this._callback.delete(FormPointEditView.parseConditionsToPoint(this._condiotions));
  }

  #changeTypePoint = (evt) => {
    if (evt.target.closest('.event__type-label')) {
      this.#point.randomOffers.forEach((element) => {
        if (element.type === evt.target.textContent) {
          const typePoint = evt.target.textContent;
          if (typePoint !== this.#point.type) {
            this.updateData({isTypePointChanged: true, offers: element.offers, type: typePoint});
          } else {
            this.updateData({isTypePointChanged: false, offers: element.offers, type: typePoint});
          }
        }
      });
    }
  }

  #changeDestinationPoint = (evt) => {
    this.#point.destinationForCities.forEach((element) => {
      if (evt.target.value === element.city) {
        const cityPoint = evt.target.value;
        const photosAndDescription = {};
        photosAndDescription.description = element.description;
        photosAndDescription.photos = element.photos;

        if (cityPoint !== this.#point.city) {
          this.updateData({isDestinationPointChanged: true, city: cityPoint, destination: photosAndDescription});
        } else {
          this.updateData({isDestinationPointChanged: false, city: cityPoint, destination: photosAndDescription});
        }
      }
    });
  }

  #changeOffersPoint = (evt) => {
    this._condiotions.offers.forEach((element) => {
      if (evt.target.value === element.title) {
        element.checked = !element.checked;
      }
    });
  }

  #changePricePoint = (evt) => {
    evt.preventDefault();
    if (evt.target.value !== this.#point.price) {
      const inputPrice = evt.target;
      const valuePrice = evt.target.value;
      inputPrice.setCustomValidity('');
      if (reForPrice.test(valuePrice)) {
        inputPrice.setCustomValidity('Можно вводить только цифры');
      }
      inputPrice.reportValidity();

      this.updateData({isPricePointChanged: true, price: evt.target.value}, true);
    } else {
      this.updateData({isPricePointChanged: false, price: evt.target.value});
    }
  }

  #setDatepicker = () => {
    this.#datepickerDateStart = flatpickr(
      this.element.querySelector('input[id=event-start-time-1]'),
      {
        dateFormat: 'j/m/y h:i',
        enableTime: true,
        enableSeconds: true,
        defaultDate: this._condiotions.dateStart,
        onChange: this.#changeDateStartPoint,
      },
    );
    this.#datepickerDateEnd = flatpickr(
      this.element.querySelector('input[id=event-end-time-1]'),
      {
        dateFormat: 'j/m/y h:i',
        enableTime: true,
        enableSeconds: true,
        defaultDate: this._condiotions.dateEnd,
        onChange: this.#changeDateEndPoint,
      }
    );
  }

  #changeDateStartPoint = ([userDate]) => {
    if (String(this.#point.dateStart) !== String(userDate)) {
      this.updateData({isDatePointChanged: true, dateStart: userDate});
    } else {
      this.updateData({isDatePointChanged: false, dateStart: userDate});
    }
  }

  #changeDateEndPoint = ([userDate]) => {
    if (String(this.#point.dateEnd) !== String(userDate)) {
      this.updateData({isDatePointChanged: true, dateEnd: userDate});
    } else {
      this.updateData({isDatePointChanged: false, dateEnd: userDate});
    }
  }

  static parsePointToConditions = (point) => ({...point,
    isTypePointChanged: false,
    isDestinationPointChanged: false,
    isDatePointChanged: false,
    isPricePointChanged: false,
  })

  static parseConditionsToPoint = (conditions) => {
    const point = {...conditions};

    delete conditions.isTypePointChanged;
    delete conditions.isDestinationPointChanged;
    delete conditions.isDatePointChanged;
    delete conditions.isPricePointChanged;

    return point;
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-wrapper').addEventListener('click', this.#changeTypePoint);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#changeDestinationPoint);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#changePricePoint);

    if (this._condiotions.offers.length !== 0) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#changeOffersPoint);
    }
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setListenerSubmit(this._callback.submit);
    this.setListenerClickClose(this._callback.clickClose);
    this.setListenerDelete(this._callback.delete);
    this.#setDatepicker();
  }

  reset = (point) => {
    this.updateData(FormPointEditView.parsePointToConditions(point));
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerDateStart) {
      this.#datepickerDateStart.destroy();
      this.#datepickerDateStart = null;
    }

    if (this.#datepickerDateEnd) {
      this.#datepickerDateEnd.destroy();
      this.#datepickerDateEnd = null;
    }
  }
}

export {FormPointEditView as default};
