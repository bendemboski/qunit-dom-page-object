import SelectorNodeFactory from './-private/selector-node-factory';

/**
 * A PageObject class, used as a container for SelectorNodes.
 */
export default class PageObject {
  constructor() {
    return createPageObject();
  }
}

function createPageObject() {
  return new Proxy({}, {
    get(target, prop, receiver) {
      let value = target[prop];
      if (value instanceof SelectorNodeFactory) {
        // SelectorNodeDefinition, so instantiate a SelectorNode that's a child of
        // this SelectorNode
        return value.create(receiver);
      } else {
        return value;
      }
    }
  });  
}
