import Host from './host';
import { flushBeforeNextRenderCallbacks } from './scheduler';

function enqueueCallback(internal, callback) {
  if (callback) {
    let callbackQueue =
      internal._pendingCallbacks ||
      (internal._pendingCallbacks = []);
    callbackQueue.push(callback);
  }
}

function enqueueState(internal, partialState) {
  if (partialState) {
    let stateQueue =
      internal._pendingStateQueue ||
      (internal._pendingStateQueue = []);
    stateQueue.push(partialState);
  }
}

function runCallbacks(callbacks, context) {
  if (callbacks) {
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i].call(context);
    }
  }
}

function runUpdate(component) {
  let internal = component._internal;
  if (!internal) {
    return;
  }

  Host.isRendering = true;

  // If updateComponent happens to enqueue any new updates, we
  // shouldn't execute the callbacks until the next render happens, so
  // stash the callbacks first
  let callbacks = internal._pendingCallbacks;
  internal._pendingCallbacks = null;

  let prevElement = internal._currentElement;
  let prevUnmaskedContext = internal._context;
  let nextUnmaskedContext = internal._penddingContext || prevUnmaskedContext;
  internal._penddingContext = undefined;

  if (internal._pendingStateQueue || internal._pendingForceUpdate) {
    internal.updateComponent(
      prevElement,
      prevElement,
      prevUnmaskedContext,
      nextUnmaskedContext
    );
  }

  runCallbacks(callbacks, component);
  Host.isRendering = false;
}

export function performWork() {
  if (Host.isRendering) {
    return;
  }

  let dirtyComponents;
  let component;
  while (Host.dirtyComponents.length > 0) {
    // before next render, we will flush all the PassiveEffects
    flushPassiveEffects();
    // stash the dirtyComponents first
    dirtyComponents = Host.dirtyComponents;
    // reset Host.dirtyComponents, using to collect dirtyComponent
    // generated by the next render
    Host.dirtyComponents = [];
    while (component = dirtyComponents.pop()) {
      runUpdate(component);
    }
  }
}

function scheduleWork(component) {
  const dirtyComponents = Host.dirtyComponents;
  if (dirtyComponents.indexOf(component) < 0) {
    dirtyComponents.push(component);
  }
  performWork();
}

export function flushPassiveEffects() {
  flushBeforeNextRenderCallbacks();
}

const Updater = {
  setState: function(component, partialState, callback) {
    let internal = component._internal;

    if (!internal) {
      return;
    }

    !Host.isRendering && flushPassiveEffects();

    enqueueState(internal, partialState);
    enqueueCallback(internal, callback);

    // pending in componentWillReceiveProps and componentWillMount
    if (!internal._pendingState && internal._renderedComponent) {
      scheduleWork(component);
    }
  },

  forceUpdate: function(component, callback) {
    let internal = component._internal;

    if (!internal) {
      return;
    }

    !Host.isRendering && flushPassiveEffects();

    internal._pendingForceUpdate = true;

    enqueueCallback(internal, callback);
    // pending in componentWillMount
    if (internal._renderedComponent) {
      scheduleWork(component);
    }
  },

  runCallbacks: runCallbacks
};

export default Updater;
