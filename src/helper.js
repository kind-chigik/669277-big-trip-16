const KEY_ESCAPE = 'Escape';
const KEY_ESC = 'Esc';

export const isKeyEsс = (evt) => evt.key === KEY_ESCAPE || evt.key === KEY_ESC;

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

export const compareElementsByPrice = (element1, element2) => element2.price - element1.price;

export const compareElementsByTime = (element1, element2) => element2.durationEvent - element1.durationEvent;

export const compareElementsByDate = (element1, element2) => element1.dateStart - element2.dateStart;
