'use babel';

import {CompositeDisposable, Emitter} from 'atom';
import CurrentPath from './views/CurrentPath.js';
import Column from './views/Column';
const fs = require('fs');
const path = require('path');

export default class AtomRangerView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atom-ranger');
    this.element.setAttribute('tabindex', '-1');

    this.columns = document.createElement('div');
    this.columns.classList.add('atom-ranger__columns');

    atom.config.set('atom-ranger.currentDir', this.getOpenedFilePath());

    const currentDir = new Column('current');
    const parentDir = new Column('parent');
    const preview = new Column('preview');

    this.element.appendChild(this.columns);
    this.columns.appendChild(parentDir);
    this.columns.appendChild(currentDir);
    this.columns.appendChild(preview);

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'atom-ranger:toggle', () => {
        this.toggle();
      }),

      atom.commands.add('atom-workspace', 'core:move-up', (e) => {
        this.changeEntry(e);
      }),

      atom.commands.add('atom-workspace', 'core:move-down', (e) => {
        this.changeEntry(e);
      }),

      atom.commands.add('atom-workspace', 'core:move-left', (e) => {
        this.changeEntry(e);
      }),

      atom.commands.add('atom-workspace', 'core:move-right', (e) => {
        this.changeEntry(e);
      }),

      atom.config.onDidChange('atom-ranger.visible', ({newValue}) => {
        if (newValue) {
          this.show();
        } else {
          this.hide();
        }
      })
    );
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.element = null;
  }

  updatePosition() {
    this.panel = atom.workspace.addBottomPanel({item: this.element})
  }

  getElement() {
    return this.element;
  }

  hide() {
    if (this.panel != null) {
      this.panel.destroy();
      this.panel = null;
    }
  }

  focusEntry(entry) {
    entry.classList.add('atom-ranger__entry_focus');
  }

  show() {
    this.hide();
    this.updatePosition();
    this.init();
  }

  init() {
    // this.updateFiles(this.activeColumn, this.getOpenedFilePath());
    // this.updateFiles(this.rootColumn, this.getOpenedFileDir());
    this.panel.item.focus();

    // setTimeout(() => {
    //   this.activeColumn.querySelectorAll('.atom-ranger__entry').forEach(entry => {
    //     if (entry.innerHTML == this.getOpenedFile()) {
    //       entry.classList.add('atom-ranger__entry_focus');
    //     }
    //   });
    // }, 30);
  }

  toggle() {
    atom.config.set('atom-ranger.visible', !atom.config.get('atom-ranger.visible'));
  }

  isDirectory(entry) {
    console.log(this.activeDirectory);
    return fs.lstatSync(path.resolve(this.activeDirectory, entry)).isDirectory();
  }

  changeEntry(e) {
    let activeElement = this.activeColumn.querySelector('.atom-ranger__entry_focus');

    if (e.type == 'core:move-up') {
      if (activeElement.previousElementSibling === null) {
        return;
      } else {
        this.clearFocus();
        activeElement.previousElementSibling.classList.add('atom-ranger__entry_focus');
      }
    } else if (e.type == 'core:move-down') {
      if (activeElement.nextElementSibling === null) {
        return;
      } else {
        this.clearFocus();
        activeElement.nextElementSibling.classList.add('atom-ranger__entry_focus');
      }
    } else if (e.type == 'core:move-left') {
      let activeDir = this.activeDirectory;
      this.updateFiles(this.activeColumn, path.dirname(this.activeDirectory));

      setTimeout(() => {
        this.activeColumn.querySelectorAll('.atom-ranger__entry').forEach(entry => {
          if (entry.innerHTML == path.basename(activeDir)) {
            entry.classList.add('atom-ranger__entry_focus');
          }
        });
      }, 30);

      this.activeDirectory = path.dirname(activeDir);
      this.updateFiles(this.rootColumn, path.dirname(this.activeDirectory));
    } else if (e.type == 'core:move-right') {
      if (this.isDirectory(activeElement.innerHTML)) {
        this.activeDirectory = path.resolve(this.activeDirectory, activeElement.innerHTML);
        this.updateFiles(this.activeColumn, this.activeDirectory);

        setTimeout(() => {
          this.activeColumn.querySelector('.atom-ranger__entry').classList.add('atom-ranger__entry_focus');
        }, 30);
      } else {
        return;
      }
    }

    setTimeout(() => {
      let activeEntry = document.querySelector('.atom-ranger__entry_focus');
      activeEntry.scrollIntoView();
      this.updatePreviewColumn(activeEntry.innerHTML);
      this.activePath.innerHTML = this.activeDirectory;
    }, 100);
  }

  updatePreviewColumn(entry) {
    if (this.isDirectory(entry)) {
      this.updateFiles(this.previewColumn, path.resolve(this.activeDirectory, entry));
    } else {
      this.previewColumn.querySelectorAll('.atom-ranger__entry').forEach(entry => {
        entry.remove();
      })
    }
  }

  getParentDir(dir) {
    return path.dirname(dir);
  }

  getOpenedFile() {
    let activePane = atom.workspace.getActivePaneItem();
    let openedFilePath = activePane.buffer.file.path;

    return path.basename(openedFilePath);
  }

  getOpenedFilePath() {
    let activePane = atom.workspace.getActivePaneItem();
    let openedFilePath = activePane.buffer.file.path;

    return path.dirname(openedFilePath);
  }

  getOpenedFileDir() {
    return path.dirname(this.getOpenedFilePath());
  }

  createColumn(type) {
    let column = document.createElement('div');
    column.classList.add('atom-ranger__column');
    column.classList.add(`atom-ranger__column_${type}`);

    return column;
  }

  createEntry(dir) {
    let entry = document.createElement('div');
    entry.classList.add('atom-ranger__entry');
    entry.textContent = dir;

    return entry;
  }

}
