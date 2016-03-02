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
   * @param {string} data
   */
  function Photo(data) {
    this._data = data;
    this.onPhotoClick = this.onPhotoClick.bind(this);
  }

  /**
   * функия по наследоваю одного прототипа от другово
   * @param {object} Photo
   * @param {object} PhotoBase
   */
  inherit(Photo, PhotoBase);

  /**
   * метод вытаскивания тепмлейта и после забиваем его датой
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
      var miniPhoto = new Image();

      this.element.querySelector('IMG').src = src; // ниже
      //element.replaceChild; короч нужно было заменить но я не понял

      miniPhoto.onerror = function() {
        this.element.classList.add('picture-load-failure');
      }.bind(this);

      miniPhoto.src = src;

      this.element.addEventListener('click', this.onPhotoClick);
    }
  };

  /**
   * Приклеивание обработчика из другого метода
   * сработка по условию
   * изначально null
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
   */
  Photo.prototype.remove = function() {
    this.element.removeEventListener('click', this.onClick);
  };

  return Photo;
});
