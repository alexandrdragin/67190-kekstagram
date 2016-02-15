'use strict';

(function() {

  function Photo(data) {
    this._data = data;
  }

  Photo.prototype.render = function() {

    var template = document.querySelector('#picture-template');

// проверка браузера
    var element;
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
      var backgroundImage = new Image();

      backgroundImage.onload = function() {

        this.element.style.backgroundImage = 'url(\'' + src + '\')';

        this.element.style.width = '182px';
        this.element.style.height = '182px';

      }.bind(this);
      this.element.querySelector('IMG').src = src; // ниже
      //element.replaceChild; короч нужно было заменить но я не понял
      backgroundImage.onerror = function() {
        this.element.classList.add('picture-load-failure');
      }.bind(this);

      backgroundImage.src = src;
    }

  };
  window.Photo = Photo;
})();
