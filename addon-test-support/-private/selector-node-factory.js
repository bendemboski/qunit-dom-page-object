import SelectorNode from './selector-node';

/**
 * A factory for creating selector nodes. The factory is constructed with a
 * selector (interpreted as a descendant selector relative to its parent) and an
 * extensions object containing properties and methods that will be accessible
 * on the selector node. The `create()` method creates SelectorNode instances as
 * child nodes of a given parent.
 */
export default class SelectorNodeFactory {
  /**
   * @param {string} selector the SelectorNode's selector
   * @param {*} extensions an optional extensions object whose
   * properties and methods will be exposed on SelectorNodes created with this
   * factory
   */
  constructor(selector, extensions) {
    this.selector = selector;
    this.extensions = extensions;
  }

  /**
   * Create a SelectorNode
   * 
   * @param {SelectorNode|PageObject} parent the SelectorNode's parent
   * @returns {SelectorNode} the new SelectorNode
   */
  create(parent) {
    return new SelectorNode(parent, this.selector, this.extensions);
  }
}
