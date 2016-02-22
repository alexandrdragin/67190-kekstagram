'use strict';

(function() {

  var Gallery = function() {
    this.overlay = document.querySelector('.gallery-overlay');
    this._clButton = this.overlay.querySelector('.gallery-overlay-close');
    this._photo = document.querySelector('.gallery-overlay-image');
    this._likes = this.overlay.querySelector('.gallery-overlay-controls-like');
    this._likesCount = document.querySelector('.likes-count');
    this._comments = this.overlay.querySelector('.gallery-overlay-controls-comments');

    this._pictures = [];
    this._currentImage = 0;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
  };

  Gallery.prototype.show = function() {
    this.overlay.classList.remove('invisible');

    this._clButton.addEventListener('click', this._onCloseClick);

    window.addEventListener('keydown', this._onDocumentKeyDown);
    this._photo.addEventListener('click', this._onPhotoClick);
    this._likes.addEventListener('click', this.like);

    for (var i = 0; i < this._pictures.length; i++) {
      if (this._pictures[i]._data === this.data) {
        this._currentImage = i;
      }
    }
    this.showCurrentPhoto();
  };

  Gallery.prototype.unshow = function() {
    this.overlay.classList.add('invisible');
    this._clButton.removeEventListener('click', this._onPhotoClick);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
    this._photo.removeEventListener('click', this._onPhotoClick);
    this._likes.removeEventListener('click', this.like);
  };

  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentImage + 1);
  };

  Gallery.prototype._onCloseClick = function() {
    this.unshow();
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    evt.preventDefault();
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

  Gallery.prototype.setPhotos = function(pictures) {
    this._pictures = pictures; // отфильтрованные малышки
    // сложный моментик потому что здесь приходят Photo
    // а по клику Object
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    if (index > this._pictures.length - 1) {
      index = 0;
    }
    if (index < 0) {
      index = this._pictures.length - 1;
    }

    this.data = this._pictures[index]._data;
    this._currentImage = index;
    this.showCurrentPhoto();
  };

  Gallery.prototype.showCurrentPhoto = function() {
    this._photo.innerHTML = ' ';

    this._photo.src = this.data.url;
    this._likes.querySelector('.likes-count').textContent = this.data.likes;
    this._comments.querySelector('.comments-count').textContent = this.data.comments;

    if (this.data.liked === true) {
      this._likesCount.classList.add('likes-count-liked');
    } else {
      this._likesCount.classList.remove('likes-count-liked');
    }
  };

  Gallery.prototype.like = function() {

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
