'use babel';

import AtomRangerView from './atom-ranger-view';
import { CompositeDisposable } from 'atom';

let atomRangerView = null;

export function activate() {
  atomRangerView = new AtomRangerView();
}

export function deactivate() {
  atomRangerView.destroy();
  atomRangerView = null;
}

export const config = {
  visible: {
    type: 'boolean',
    default: true,
    order: 1
  }
}
