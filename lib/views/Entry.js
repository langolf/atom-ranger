'use babel';

export default class Entry {
  constructor(data) {
    this.data = data;
    this.element = document.createElement('div');
    this.element.classList.add('atom-ranger__entry');
    this.element.textContent = data;

    return this.element;
  }

  getEntry() {
    return this.element;
  }

  setActive() {
    this.element.classList.add('atom-ranger__entry_focus');
  }
}
