/**
 * @fileoverview
 * @author Alexandr Dragin
 */

define(function() {
  var a, b;

  /**
   *  проверка типа приходящего обьекта после upload
   * @param {number|object|boolean} a - параметр для анализа
   * @param {object} b - параметр для анализа
   * @return {string} - сообщение
   */
  function getMessage (a, b) {

    if (typeof a === "boolean") {
      if (a == true) {
        return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
      }
      else {
         return "Переданное GIF-изображение не анимировано";
      }
    };

    if (typeof a === "number") {
      return ("Переданное SVG-изображение содержит " + a + " объектов и " + (b * 4) + " аттрибутов");
    }

    if (typeof a === "object" && typeof b === "undefined") {
      var sum = 0;

      for (var i = 0; i < a.length; i++) {
        sum += a[i];
      };

      return "Количество красных точек во всех строчках изображения: " + sum + ".";
    };

    if (typeof a === "object" && typeof b === "object") {
      var square = 0;
      if (a.length === b.length) {
        for (var i = 0; i < a.length; i++) {
          square += a[i] * b[i];
        }
      }

      return "Общая площадь артефактов сжатия: " + square + " пикселей";
    };

  };

})
