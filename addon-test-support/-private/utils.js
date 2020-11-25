/* global QUnit */
import getState from './get-state';

/**
 * Get the single DOM element described by this SelectorNode. This will either
 * be the first element matching the SelectorNode's selector relative to the
 * single DOM element described by its parent SelectorNode, or the `index`th
 * matching element if this SelectorNode has an index
 *
 * @param {SelectorNode} node the SelectorNode
 * @returns {Element|null} the single DOM element described by this SelectorNode
 * if it exists
 */
export function getElement(node) {
  let { parent } = getState(node);
  if (!parent) {
    // The SelectorNode does not have a parent, so its element is the root
    return QUnit.config.current.assert.dom.rootElement;
  }

  let parentElement = getElement(parent);
  if (!parentElement) {
    return null;
  }
  
  let { selector, index } = getState(node);
  if (index === null) {
    return parentElement.querySelector(selector);
  } else {
    return parentElement.querySelectorAll(selector)[index] || null;
  }
}

/**
 * Get a qunit-dom assertion object for this SelectorNode. If the SelectorNode
 * has an index, it will be initialized with the single DOM element referenced
 * by the SelectorNode, and if not, it will be initialized with SelectorNode's
 * selector, and a root element of // the single DOM element referenced by the
 * SelectorNode's parent.
 *
 * @param {SelectorNode} node the SelectorNode
 * @returns {DOMAssertions} a qunit-dom DOMAssertions object for this
 * SelectorNode
 */
export function getAssert(node) {
  let { parent, selector, index } = getState(node);

  let parentElement = getElement(parent);
  if (parentElement) {
    if (index === null) {
      // We have a parent element and no index, so we can use our
      // selector
      return QUnit.config.current.assert.dom(selector, parentElement);
    } else {
      // We have a parent element with an index, so we have to use our
      // element if it exists. If it doesn't, we fall through to the
      // no-match case
      let element = parentElement.querySelectorAll(selector)[index];
      if (element) {
        return QUnit.config.current.assert.dom(element);  
      }
    }
  }

  // We can't pass valid info to qunit-dom describing our element, so
  // keep the selector so it shows up in the assert, but pass in an
  // empty div as the selector root so it's certain not to match
  // anything
  return QUnit.config.current.assert.dom(selector, document.createElement('div'));  
}