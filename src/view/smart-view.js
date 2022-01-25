import AbstractView from './abstract-view.js';

class SmartView extends AbstractView {
  updateElement = () => {
    const prevElement = this.element;
    const parentElement = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    parentElement.replaceChild(newElement, prevElement);
  }

  updateData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._condiotions = {...this._condiotions, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Абстрактный метод не имплементирован: restoreHandlers');
  }
}

export {SmartView as default};
