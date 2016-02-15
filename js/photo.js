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
/*
        element.style.width = '182px';
        element.style.height = '182px';
        element.width = 182;
        element.height = 182;
        element.backgroundSize = '182px 182px'; // не работает устновка размеров
*/
      };
      //this.element.querySelector('IMG').src = src; //по этому хакнул ваш код
      //element.replaceChild;
      backgroundImage.onerror = function() {
        this.element.classList.add('picture-load-failure');
      };

      backgroundImage.src = src;
    }

  };
  window.Photo = Photo;
})();
