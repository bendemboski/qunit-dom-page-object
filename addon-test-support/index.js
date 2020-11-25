import SelectorNodeFactory from './-private/selector-node-factory';

export { default as PageObject } from './page-object';

/**
 * Define a selector node
 *
 * @param {string} selector the selector relative to the parent SelectorNode
 * @param {*} Extensions optional Extensions class used to extend the
 * functionality of the SelectorNode
 */
export function selector(selector, Extensions) {
  let extensions;
  if (Extensions) {
    extensions = new Extensions();
  }
  return new SelectorNodeFactory(selector, extensions);
}
