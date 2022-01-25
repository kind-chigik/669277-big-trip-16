import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const CITIES = ['Geneva', 'Barcelona', 'Valencia', 'Amsterdam', 'Miami', 'Los Angeles', 'Chicago'];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const OFFERS = [
  'Add luggage',
  'Switch to comfort class',
  'Add meal',
  'Choose seats',
  'Travel by train',
  'Order Uber',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
];

const getRandomNumber = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElement = (array) => {
  const randomIndex = getRandomNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomDescription = (array) => {
  const randomNumber = getRandomNumber(0, 5);
  let randomDescription = '';
  for (let i = 0; i <= randomNumber; i++) {
    randomDescription += `${getRandomElement(array)} `;
  }
  return randomDescription;
};

const getRandomPhotos = () => {
  const numberPhotos = getRandomNumber(0, 4);
  const randomPhotos = [];
  for (let i = 0; i <= numberPhotos; i++) {
    randomPhotos.push(`http://picsum.photos/248/152?r=${getRandomNumber(0, 5)}`);
  }
  return randomPhotos;
};

const getDateStart = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomNumber(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const getDateEnd = () => {
  const daysGap = getRandomNumber(8, 16);

  return dayjs().add(daysGap, 'day').add(daysGap, 'm').toDate();
};

const getRandomOffers = () => {
  const randomOffers = [];

  let offers = [];
  for (const element of TYPES) {
    const type = element;
    const countOffers = getRandomNumber(0, 5);
    for (let i = 0; i < countOffers; i++) {
      const title = getRandomElement(OFFERS);
      const cost = getRandomNumber(10, 100);
      const checked = Boolean(getRandomNumber());
      offers.push({title, cost, checked});
    }
    randomOffers.push({type, offers});
    offers = [];
  }

  return randomOffers;
};

const getDestinationForCities = () => {
  const destinationForCities = [];

  for (const city of CITIES) {
    let description = '';
    const countSentence = getRandomNumber(0, 5);
    for (let i = 0; i < countSentence; i++) {
      description += getRandomDescription(DESCRIPTIONS);
    }
    let photos = [];
    const countPhotos = getRandomNumber(0, 5);
    for (let i = 0; i < countPhotos; i++) {
      photos.push(getRandomPhotos());
    }

    destinationForCities.push({city, description, photos});
    description = [];
    photos = [];
  }

  return destinationForCities;
};

const generatePoint = () => {
  const type = getRandomElement(TYPES);
  const randomOffers = getRandomOffers();
  let offers;
  randomOffers.forEach((element) => {
    if (element.type === type) {
      offers = element.offers;
    }
  });

  const city = getRandomElement(CITIES);
  const destinationForCities = getDestinationForCities();
  const destination = {};
  destinationForCities.forEach((element) => {
    if (element.city === city) {
      destination.description = element.description;
      destination.photos = element.photos;
    }
  });

  return {
    id: nanoid(),
    type,
    city,
    destination,
    dateStart: getDateStart(),
    dateEnd: getDateEnd(),
    price: getRandomNumber(0, 500000),
    isFavorite: Boolean(getRandomNumber()),
    offers,
    randomOffers,
    destinationForCities,
  };
};

const generateZeroPoint = () => {
  const type = getRandomElement(TYPES);
  const randomOffers = getRandomOffers();

  const city = getRandomElement(CITIES);
  const destinationForCities = getDestinationForCities();
  const destination = {};
  destinationForCities.forEach((element) => {
    if (element.city === city) {
      destination.description = element.description;
      destination.photos = element.photos;
    }
  });

  return {
    id: nanoid(),
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
    offers: [],
    randomOffers,
    destinationForCities,
  };
};

export {generatePoint, generateZeroPoint};
