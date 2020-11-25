const STATE_MAP = new WeakMap();

/**
 * Get a state POJO for a given object. Storing it in a WeakMap allows us to
 * store internal state for objects without having to set properties directly on
 * them, whose names might conflict with user-defined properties.
 *
 * @param {object} object the object
 * @returns {object} the state object
 */
export default function getState(object) {
  let state = STATE_MAP.get(object);
  if (!state) {
    state = {};
    STATE_MAP.set(object, state);
  }
  return state;
}
