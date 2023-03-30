import { action, autorun, computed, makeObservable, observable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

class State {
  constructor() {
    this.id = uuidv4();
    this.state = {};
    this.listeners = [];

    makeObservable(this, {
      state: observable,
      setState: action,
      getState: computed,
    });
  }

  setState(state, merge = true) {
    this.state = merge ? { ...this.state, ...state } : state;
  }

  get getState() {
    return this.state;
  }

  addListener(callback) {
    this.listeners = this.listeners.concat(autorun(callback));

    // returns index of the added listener - shall be used to remove
    return this.listeners.length - 1;
  }

  removeListener(index) {
    if (index < this.listeners.length && this.listeners[index]) {
      this.listeners[index]();
      this.listeners[index] = null;
    }
  }

  resetListeners() {
    this.listeners = [];
  }
}

window.DIState = new State();
