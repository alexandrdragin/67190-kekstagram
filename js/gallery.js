/**
 * @fileoverview
 * @author Alexandr Dragin
 */

'use strict';

define(function() {

  /**
   * Конструктор Галерреи
   * @constructor
   */
  var Gallery = function() {
    /**
     * @type {HTMLElement}
     * @private
     */
    this.overlay = document.querySelector('.gallery-overlay');
    this._clButton = this.overlay.querySelector('.gallery-overlay-close');
    this._photo = document.querySelector('.gallery-overlay-image');
    this._likes = this.overlay.querySelector('.gallery-overlay-controls-like');
    this._likesCount = document.querySelector('.likes-count');
    this._comments = this.overlay.querySelector('.gallery-overlay-controls-comments');

    /**
     * @type {Array.<Object>}
     * @private
     */
    this._pictures = [];

    /**
     * @type {number}
     * @private
     */
    this._currentImage = 0;

    /**
     * Бинды всех евентлиснеров
     * @private
     */
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._like = this._like.bind(this);

    this._onHashChange = this._onHashChange.bind(this);
  };

  /**
   * метод для начала работы
   * @type {Object}
   * @param {string} hash
   */
  Gallery.prototype.show = function(hash) {
    this.overlay.classList.remove('invisible');

    this._clButton.addEventListener('click', this._onCloseClick);

    window.addEventListener('keydown', this._onDocumentKeyDown);
    this._photo.addEventListener('click', this._onPhotoClick);
    this._likes.addEventListener('click', this._like);

    // поиск фото по хешу и установка даты
    for (var i = 0; i < this._pictures.length; i++) {
      if (this._pictures[i].url === hash) {
        this._currentImage = i;
        this.data = this._pictures[i];
      }
    }

    this.showCurrentPhoto();
  };

  /**
   * метод для конца работы и уборки
   * @type {Object}
   */
  Gallery.prototype.hide = function() {
    this.overlay.classList.add('invisible');
    this._clButton.removeEventListener('click', this._onPhotoClick);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
    this._photo.removeEventListener('click', this._onPhotoClick);
    this._likes.removeEventListener('click', this._like);

    location.hash = '';
  };

  /**
   * Указание что посеридине делать.
   * @type {Object}
   * @private
   */
  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentImage + 1);
  };

  /**
   * Указание что по кресту делать.
   * @type {Object}
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Обработчик события кейдаун.
   * @type {Object}
   * @param {evt} DocumentKeyDown
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    }
    if (evt.keyCode === 39) {
      evt.preventDefault();
      this.setCurrentPhoto(this._currentImage + 1);
    }
    if (evt.keyCode === 37) {
      evt.preventDefault();
      this.setCurrentPhoto(this._currentImage - 1);
    }
  };

  /**
   * Важный метод. принимает данные из pictures.js после каждой фильтрации.
   * @type {Object}
   * @param {Array.Object} pictures
   */
  Gallery.prototype.setPhotos = function(pictures) {
    this._pictures = pictures; // отфильтрованные малышки

    window.addEventListener('hashchange', this._onHashChange);
  };

  /**
   * Метод по изменению индекса.
   * @type {Object}
   * @param {number} index
   */
  Gallery.prototype.setCurrentPhoto = function(index) {

    if (index > this._pictures.length - 1) {
      index = 0;
    }
    if (index < 0) {
      index = this._pictures.length - 1;
    }

    this.data = this._pictures[index];
    this._currentImage = index;

    location.hash = '#photo' + '/' + this.data.url;
  };

  /**
   * Забивание оверлея данными.
   * @type {Object}
   */
  Gallery.prototype.showCurrentPhoto = function() {
    this._photo.innerHTML = ' ';

    this._photo.src = this.data.preview || this.data.url;
    this._likes.querySelector('.likes-count').textContent = this.data.likes;
    this._comments.querySelector('.comments-count').textContent = this.data.comments;

    // проверка наличия нового свойства
    if (this.data.liked === true) {
      this._likesCount.classList.add('likes-count-liked');
    } else {
      this._likesCount.classList.remove('likes-count-liked');
    }
  };

  /**
   * Метод по клику на лайк, проверям, доб класс, изменяем данные
   * @type {Object}
   * @private
   */
  Gallery.prototype._like = function() {

    if (this.data.liked !== true) {
      this._likesCount.classList.add('likes-count-liked');
      this.data.likes = this.data.likes + 1;
      this._likes.querySelector('.likes-count').textContent = this.data.likes;
      this.data.liked = true;
    } else {
      this._likesCount.classList.remove('likes-count-liked');
      this.data.likes = this.data.likes - 1;
      this._likes.querySelector('.likes-count').textContent = this.data.likes;
      this.data.liked = false;
    }
  };

  /**
   * Определяет необходимость отображать галерею по хешу
   * вызываем при изменении страницы и после загрузки
   * @type {Object}
   * @private
   */
  Gallery.prototype._onHashChange = function() {
    var matchedHash = location.hash.match(/#photo\/(\S+)/);
    if (Array.isArray(matchedHash)) {
      this.show(matchedHash[1]);
    } else {
      this.hide();
    }
  };

  return Gallery;
});
/*
Еще дополнительное задание
Перепишите галерею таким образом, чтобы показ фотографии осуществлялся
с помощью объекта типа PhotoPreview. Унаследуйте этот объект и объект Photo
от общего объекта PhotoBase с помощью функции inherit,
которую вы написали в предыдущем задании. ЗАЧЕМ?????
*/
