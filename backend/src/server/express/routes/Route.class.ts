/** CLASS: Route
 * @description This class is a generic class for all routes. This is used for helper functions that are used in all routes.
 * @returns {Route} - The ModelRoute object.
 */
class Route {
  /**
   * Get all the public methods (functions) in this class.
   * @returns {string[]} - An array of all the methods in the class.
   */
  getMethods(): string[] {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this));
  }
}

export default Route;
