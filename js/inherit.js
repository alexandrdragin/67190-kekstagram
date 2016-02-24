/**
 * @fileoverview
 * @author Alexandr Dragin
 */

'use strict';

define(function() {

 /**
   * Прото наследование
   * @param {function} child constructor function
   * @param {function} parent constructor function
   */
  function inherit(child, parent) {

    var TempConstructor = function() {};
    TempConstructor.prototype = parent.prototype;
    child.prototype = new TempConstructor();

  }

  return inherit;

});
