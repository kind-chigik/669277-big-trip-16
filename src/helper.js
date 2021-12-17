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

