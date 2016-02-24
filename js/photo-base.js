/**
 * @fileoverview
 * @author Alexandr Dragin
 */

'use strict';

define(function() {

  /**
   * Конструкторор Базы со свойствами для каждой фотографии
   * можно было сюда и больше свойст перенести из Photo.Js
   * но я так и не понял зачем
   * @constructor
   */
  function PhotoBase() {}
  PhotoBase.prototype._data = null;
  PhotoBase.prototype.render = function() {};
  PhotoBase.prototype.remove = function() {};
  PhotoBase.prototype.onPhotoClick = function() {};

  /**
   * Бесполезный метод по установке данных, нигде не вызывается
   * @param {Object} data
   */
  PhotoBase.prototype.setData = function(data) {
    this._data = data;
  };

  /**
   * Бесполезный метод по получению данных, нигде не вызывается
   * @return {Object}
   */
  PhotoBase.prototype.getData = function() {
    return this._data;
  };

  /**
   * Неудаляемый пустой шаблон под клик
   */
  PhotoBase.prototype.onClick = null;

  return PhotoBase;

});
