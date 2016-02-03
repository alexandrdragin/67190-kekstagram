'use strict';

(function() {

  var filtersForm = document.querySelector('form[class="filters hidden"]');
  filtersForm.className = 'filters';

  var contaner = document.querySelector('.pictures');
  var loadedSomeShitFromServer = null;

  getSomeShit();

/**
  * Загрузка данных
  */
  function getSomeShit() {
    var xhr = new XMLHttpRequest();

    xhr.open('get', 'http://o0.github.io/assets/json/pictures.json');
    xhr.timeout = 10000;

    xhr.onload = function(evt) {
      var firstShit = evt.target.response;
      loadedSomeShitFromServer = JSON.parse(firstShit);

      renderPictures(loadedSomeShitFromServer);
    };

    xhr.send();
  }

  /**
    * Отрисовка данных
    */
  function renderPictures(pictures) {
    pictures.forEach(function(pictureData) {
      var element = getElementFromTemplate(pictureData);
      contaner.appendChild(element);
    });
  }

  function getElementFromTemplate(data) {

    var template = document.querySelector('#picture-template');

    if ('content' in template) {
      var element = template.content.children[0].cloneNode(true);
    } else {
      var element = template.children[0].cloneNode(true);
    }

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var src = data.preview || data.url;

    if (src) {
      var backgroundImage = new Image();

      backgroundImage.onload = function() {

        element.style.backgroundImage = 'url(\'' + src + '\')';
/*
        element.style.width = '182px';
        element.style.height = '182px';
        element.width = 182;
        element.height = 182;
        element.backgroundSize = '182px 182px'; // не работает устновка размеров
*/
      };
      element.querySelector('IMG').src = src; //по этому хакнул ваш код
      //element.replaceChild;
      backgroundImage.onerror = function() {
        element.classList.add('picture-load-failure');
      };

      backgroundImage.src = src;
      /*
      backgroundImage.backgroundSize = '182px 182px';
      backgroundImage.style.width = '182px';
      backgroundImage.style.height = '182px';
      backgroundImage.width = 182;
      backgroundImage.height = 182;
      */
    }

    return element;

  }

})();
