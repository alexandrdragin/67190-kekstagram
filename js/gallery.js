'use strict';

(function() {

  var Gallery = function() {
    this.overlay = document.querySelector('.gallery-overlay');
    this._clButton = this.overlay.querySelector('.gallery-overlay-close');
    this._photo = document.querySelector('.gallery-overlay-image');
    this._likes = document.querySelector('.gallery-overlay-controls-like');
    this._comments = document.querySelector('.gallery-overlay-controls-comments');

    this.pictures = [];
    this.currentImage = 0;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
  };

  Gallery.prototype.show = function() {
    this.overlay.classList.remove('invisible');

    this._clButton.addEventListener('click', this._onCloseClick);

    window.addEventListener('keydown', this._onDocumentKeyDown);
    this._photo.addEventListener('click', this._onPhotoClick);
  };

  Gallery.prototype.unshow = function() {
    this.overlay.classList.add('invisible');
    this._clButton.removeEventListener('click', this._onPhotoClick);
    window.removeEventListener('keydown', this._onDocumentKeyDown);
    this._photo.removeEventListener('click', this._onPhotoClick);
  };

  Gallery.prototype._onPhotoClick = function() {
    console.log('work');
  };

  Gallery.prototype._onCloseClick = function() {
    this.unshow();
  };

  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.unshow();
    }
  };

  Gallery.prototype.setPhotos = function( ) {

  };

  Gallery.prototype.setCurrentPhoto = function() {

  };


  window.Gallery = Gallery;
})();
