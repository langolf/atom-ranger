'use babel';

import fs from 'fs';
import path from 'path';
import Entry from './Entry';

export default class Column {
  constructor(type) {
    this.type = type;
    this.dir = atom.config.get('atom-ranger.currentDir');
    this.entries = [];

    this.element = document.createElement('div');
    this.element.classList.add('atom-ranger__column');

    this.update();

    return this.element;
  }

  update() {
    this.clear();

    console.log(this.dir);
    console.log(this.type);

    if (this.type == 'parent') {
      this.dir = path.dirname(atom.config.get('atom-ranger.currentDir'));
    }

    if (this.type == 'current') {
      this.dir = atom.config.get('atom-ranger.currentDir');
    }

    this.getFiles(this.dir).forEach(file => {
      this.entries.push(file);
      let entry = new Entry(file);
      this.element.appendChild(entry);
    })
  }

  getFiles(dir) {
    return fs.readdirSync(dir);
  }

  getEntries() {
    return this.entries;
  }

  clear() {
    this.element.querySelectorAll('.atom-ranger__entry').forEach(entry => {
      entry.remove();
    });
  }

  setActiveEntry(e) {
    this.element.querySelectorAll('.atom')
  }

  getActiveEntry() {
    return this.element.querySelector('.atom-ranger__entry_focus');
  }

  clearFocus() {
    let entries = this.activeColumn.querySelectorAll('.atom-ranger__entry');
    entries.forEach(entry => {
      entry.classList.remove('atom-ranger__entry_focus');
    });
  }
}
