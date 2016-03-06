/**
 * @fileoverview
 * @author Alexandr Dragin
 */

'use strict';

define([
  'inherit',
  'photo-base'
], function(inherit, PhotoBase) {

  /**
   * основные данные для каждой фото в галлерее приявязаны намертво
   * @constructor
   * @param {Object} data
   */
  function Photo(data) {
    this._data = data;
    this.onPhotoClick = this.onPhotoClick.bind(this);
  }

  /**
   * функия по наследоваю одного прототипа от другово
   * @param {Object} Photo
   * @param {Object} PhotoBase
   */
  inherit(Photo, PhotoBase);

  /**
   * метод вытаскивания тепмлейта и после забиваем его датой
   * @type {Object}
   */
  Photo.prototype.render = function() {

    var template = document.querySelector('#picture-template');

    // проверка браузера
    if ('content' in template) {
      this.element = template.content.querySelector('.picture').cloneNode(true);
    } else {
      this.element = template.querySelector('.picture').cloneNode(true);
    }
    /* варианты кросбраузености
    if (navigator.appName === 'Microsoft Internet Explorer' || 'Edge') {
      element = template.content.children[0].cloneNode(true);
      element = template.content.childNodes[1].cloneNode(true);
    }
    */

    this.element.querySelector('.picture-comments').textContent = this._data.comments;
    this.element.querySelector('.picture-likes').textContent = this._data.likes;

    var src = this._data.preview || this._data.url;

    if (src) {
      var zameniMenya = this.element.querySelector('IMG');

      var miniPhoto = new Image();

      miniPhoto.src = src;
      miniPhoto.width = 182;
      miniPhoto.height = 182;

      miniPhoto.onload = function() {
        this.element.replaceChild(miniPhoto, zameniMenya);
      }.bind(this);

      miniPhoto.onerror = function() {
        this.element.classList.add('picture-load-failure');
      }.bind(this);

      this.element.addEventListener('click', this.onPhotoClick);
    }

  };

  /**
   * Приклеивание обработчика из другого метода
   * сработка по условию
   * изначально null
   * @type {Object}
   * @param {event} evt
   */
  Photo.prototype.onPhotoClick = function(evt) {
    evt.preventDefault();
    if (
      this.element.classList.contains('picture') &&
      !this.element.classList.contains('picture-load-failure')
    ) {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    }
  };

  /**
   * чисто
   * @type {Object}
   */
  Photo.prototype.remove = function() {
    this.element.removeEventListener('click', this.onClick);
  };

  return Photo;
});
