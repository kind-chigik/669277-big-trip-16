import AbstractView from './view/abstract-view.js';

const renderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const renderElement = (container, element, place) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case renderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case renderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case renderPosition.BEFOREEND:
      parent.append(child);
      break;
    case renderPosition.AFTEREND:
      parent.after(child);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export {renderPosition, renderElement, createElement};
