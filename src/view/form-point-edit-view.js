import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {RE_FOR_PRICE} from '../const.js';

const createOffers = (offersPoint, isDisabled) => {
  const fragments = [];
  offersPoint.forEach((offer) => {
    const {title, price, id} = offer;
    fragments.push(`<div class="event__available-offers">
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" value="${title}" ${offer.checked === true ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`);
  });

  return fragments.join('');
};

const createPhotos = (photosPoint) => {
  if (photosPoint) {
    const fragments = [];
    photosPoint.forEach((photo) => {
      fragments.push(`<img class="event__photo" src="${photo.src}" alt="Event photo">`);
    });

    return fragments.join('');
  }
};

const createTypesPoints = (offersPoints, checkedType, isDisabled) => {
  const fragments = [];
  offersPoints.forEach((element) => {
    const {type} = element;
    fragments.push(`<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === checkedType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>
    `);
  });

  return fragments.join('');
};

const createCities = (destinationsPoints) => {
  const fragments = [];
  destinationsPoints.forEach((element) => {
    fragments.push(`<option value="${element.name}"></option>`);
  });

  return fragments.join('');
};

const getDeleteValue = (isPointNew, isDeleting) => {
  let value = '';
  if (isPointNew) {
    value = 'Cancel';
    return value;
  }

  if (isDeleting) {
    value = 'Deleting';
  } else {
    value = 'Delete';
  }
  return value;
};

const createFormPointEdit = (pointWithConditions, originCity, offersPoints, destinationsPoints) => {
  const {type, city, dateStart, dateEnd, price, offers, destination, isDisabled, isSaving, isDeleting} = pointWithConditions;
  const {description, photos} = destination;
  const isPointHasDescription = description === '' && photos.length === 0 ? 'visually-hidden' : '';
  const isPointHasOffers = offers.length === 0 ? 'visually-hidden' : '';
  const isPointNew = originCity === '';
  const isSaveDisabled = (city === '') || (dateStart === '') || (dateEnd === '') ||  (dateEnd < dateStart) || isDisabled ? 'disabled' : '';


  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypesPoints(offersPoints, type, isDisabled)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
          ${createCities(destinationsPoints)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaveDisabled}>${isSaving ? 'Saving' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${getDeleteValue(isPointNew, isDeleting)}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
    <section class="event__section  event__section--offers ${isPointHasOffers}">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  ${createOffers(offers, isDisabled)}
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
  #destinations = null;
  #offers = null;
  #datepickerDateStart = null;
  #datepickerDateEnd = null;

  constructor(point, destinations, offers) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this._condiotions = FormPointEditView.parsePointToConditions(point);

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createFormPointEdit(this._condiotions, this.#point.city, this.#offers, this.#destinations);
  }

  #typePointClickHandler = (evt) => {
    if (evt.target.closest('.event__type-label')) {
      this.#offers.forEach((element) => {
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

  #destinationPointInputHandler = (evt) => {
    this.#destinations.forEach((element) => {
      if (evt.target.value === element.name) {
        const cityPoint = evt.target.value;
        const photosAndDescription = {};
        photosAndDescription.description = element.description;
        photosAndDescription.photos = element.pictures;

        if (cityPoint !== this.#point.city) {
          this.updateData({isDestinationPointChanged: true, city: cityPoint, destination: photosAndDescription});
        } else {
          this.updateData({isDestinationPointChanged: false, city: cityPoint, destination: photosAndDescription});
        }
      }
    });
  }

  #offersPointClickHandler = (evt) => {
    const updatedOffers = [];
    let updatedOffer = {};
    if (evt.target.value) {
      this._condiotions.offers.forEach((element) => {
        if (evt.target.value === element.title) {
          updatedOffer = {
            id: element.id,
            title: element.title,
            price: element.price,
            checked: !element.checked,
          };
        } else {
          updatedOffer = {
            id: element.id,
            title: element.title,
            price: element.price,
            checked: element.checked,
          };
        }
        updatedOffers.push(updatedOffer);
      });
      this.updateData({offers: updatedOffers});
    }
  }

  #pricePointInputHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.value !== this.#point.price) {
      const inputPrice = evt.target;
      const valuePrice = evt.target.value;
      inputPrice.setCustomValidity('');
      if (RE_FOR_PRICE.test(valuePrice)) {
        inputPrice.setCustomValidity('Можно вводить только цифры');
      }
      inputPrice.reportValidity();

      this.updateData({isPricePointChanged: true, price: valuePrice}, true);
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
        onChange: this.#dateStartPointClickHandler,
      },
    );
    this.#datepickerDateEnd = flatpickr(
      this.element.querySelector('input[id=event-end-time-1]'),
      {
        dateFormat: 'j/m/y h:i',
        enableTime: true,
        enableSeconds: true,
        defaultDate: this._condiotions.dateEnd,
        onChange: this.#dateEndPointClickHandler,
      }
    );
  }

  #dateStartPointClickHandler = ([userDate]) => {
    if (String(this.#point.dateStart) !== String(userDate)) {
      this.updateData({isDatePointChanged: true, dateStart: userDate});
    } else {
      this.updateData({isDatePointChanged: false, dateStart: userDate});
    }
  }

  #dateEndPointClickHandler = ([userDate]) => {
    if (String(this.#point.dateEnd) !== String(userDate)) {
      this.updateData({isDatePointChanged: true, dateEnd: userDate});
    } else {
      this.updateData({isDatePointChanged: false, dateEnd: userDate});
    }
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-wrapper').addEventListener('click', this.#typePointClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationPointInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#pricePointInputHandler);

    if (this._condiotions.offers.length !== 0) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersPointClickHandler);
    }
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(FormPointEditView.parseConditionsToPoint(this._condiotions));
  }

  setButtonCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonCloseClickHandler);
  }

  #buttonCloseClickHandler = () => {
    this._callback.closeClick();
  }

  setButtomDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#buttonDeleteClickHandler);
  }

  #buttonDeleteClickHandler = () => {
    this._callback.deleteClick(FormPointEditView.parseConditionsToPoint(this._condiotions));
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setButtonCloseClickHandler(this._callback.closeClick);
    this.setButtomDeleteClickHandler(this._callback.deleteClick);
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

  static parsePointToConditions = (point) => ({...point,
    isTypePointChanged: false,
    isDestinationPointChanged: false,
    isDatePointChanged: false,
    isPricePointChanged: false,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  })

  static parseConditionsToPoint = (conditions) => {
    const point = {...conditions};

    delete point.isTypePointChanged;
    delete point.isDestinationPointChanged;
    delete point.isDatePointChanged;
    delete point.isPricePointChanged;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}

export {FormPointEditView as default};
