'use strict';

(function() {

  var Gallery = function() {
    this.inHtml = document.querySelector('.gallery-overlay');
    this._clButton = this.inHtml.querySelector('.gallery-overlay-close');

    this._clClick = this._clClick.bind(this);
  };

  Gallery.prototype.show = function() {
    this.inHtml.classList.remove('invisible');

    this._clButton.addEventListener('click', function() {
      this.hide();
    }.bind(this));
  };

  Gallery.prototype.unshow = function() {
    this.inHtml.classList.add('invisible');
    this._clButton.removeEventListener('click', this._clClick);
  };

  Gallery.prototype._clClick = function() {
    this.unshow();
  };

  window.Gallery = Gallery;
})();
