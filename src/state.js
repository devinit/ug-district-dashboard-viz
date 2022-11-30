import { makeObservable, observable, action, computed, autorun } from 'mobx';

class State {
  constructor() {
    this.id = Math.random();
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
