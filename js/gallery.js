'use strict';

(function() {

  var Gallery = function() {
    this.inHtml = document.querySelector('.gallery-overlay');
    this._clButton = this.inHtml.querySelector('.gallery-overlay-close');

    this._onPhotoClick = this._onPhotoClick.bind(this);
  };

  Gallery.prototype.show = function() {
    this.inHtml.classList.remove('invisible');

    this._clButton.addEventListener('click', function() {
      this.unshow();
    }.bind(this));
  };

  Gallery.prototype.unshow = function() {
    this.inHtml.classList.add('invisible');
    this._clButton.removeEventListener('click', this._onPhotoClick);
  };

  Gallery.prototype._onPhotoClick = function() {
    this.unshow();
  };

  window.Gallery = Gallery;
})();
