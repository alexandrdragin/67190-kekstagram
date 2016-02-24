/**
 * @fileoverview
 * @author Alexandr Dragin
 */

'use strict';

(function() {

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
     * @type {Array}
     * @private
     */
    this._pictures = [];

    /**
     * @type {Number}
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
  };

  /**
   * метод для начала работы
   * @type {object}
   */
  Gallery.prototype.show = function() {
    this.overlay.classList.remove('invisible');

    this._clButton.addEventListener('click', this._onCloseClick);

    window.addEventListener('keydown', this._onDocumentKeyDown);
    this._photo.addEventListener('click', this._onPhotoClick);
    this._likes.addEventListener('click', this._like);

    //сравниваем обьекты с клика и сетФотос, находим равный и выставляем индекс
    for (var i = 0; i < this._pictures.length; i++) {
      if (this._pictures[i]._data === this.data) {
        this._currentImage = i;
      }
    }
    this.showCurrentPhoto();
  };

  /**
   * метод для конца работы
   * @type {object}
   */
  Gallery.prototype.unshow = function() {
    this.overlay.classList.add('invisible');
    this._clButton.removeEventListener('click', this._onPhotoClick);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
    this._photo.removeEventListener('click', this._onPhotoClick);
    this._likes.removeEventListener('click', this._like);
  };

  /**
   * Указание что посеридине делать.
   * @private
   */
  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentImage + 1);
  };

  /**
   * Указание что по кресту делать.
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    this.unshow();
  };

  /**
   * Обработчик события кейдаун.
   * @param {DocumentKeyDown} evt
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.unshow();
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
   * @param {Array} pictures
   */
  Gallery.prototype.setPhotos = function(pictures) {
    this._pictures = pictures; // отфильтрованные малышки
    // тут сложный моментик потому что приходят Photo
    // а по клику Object
  };

  /**
   * Метод по изменению индекса.
   * @param {number} index
   */
  Gallery.prototype.setCurrentPhoto = function(index) {
    if (index > this._pictures.length - 1) {
      index = 0;
    }
    if (index < 0) {
      index = this._pictures.length - 1;
    }

    // записывает в текущие данные, данные с новым индеском, меняет текущий индх
    this.data = this._pictures[index]._data;
    this._currentImage = index;
    this.showCurrentPhoto();
  };

  /**
   * Забивание оверлея данными.
   */
  Gallery.prototype.showCurrentPhoto = function() {
    this._photo.innerHTML = ' ';

    this._photo.src = this.data.url;
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

  window.Gallery = Gallery;
})();
/*
Еще дополнительное задание
Перепишите галерею таким образом, чтобы показ фотографии осуществлялся
с помощью объекта типа PhotoPreview. Унаследуйте этот объект и объект Photo
от общего объекта PhotoBase с помощью функции inherit,
которую вы написали в предыдущем задании. ЗАЧЕМ?????


Дополнительное задание для маньяков
Создайте еще один тип объектов: видео в галерее.
Унаследуйте его от объекта Photo.
Этот объект должен вместо фотографии показывать видео с помощью элемента HTMLVideoElement.
Определяйте, какой объект — Photo или ваш объект — использовать по наличию атрибута url в данных.
Видео должно автоматически включаться и проигрываться в цикле.
Видео должно ставиться на паузу и сниматься с нее по клику
(в этом случае нужно отменять переключение слайда, но это не страшно,
вы же выполнили первое допзадание, если добрались до этого).
*/
