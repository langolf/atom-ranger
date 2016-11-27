'use babel';

export default class CurrentPath {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('atom-ranger__path');
    this.element.textContent = 'HAHAHAH';

    this.element.addEventListener('click', () => {
      alert('1');
    })

    return this.element;
  }
}
