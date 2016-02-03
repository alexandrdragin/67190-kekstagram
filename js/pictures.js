'use strict';

(function() {

  var filtersForm = document.querySelector('form[class="filters hidden"]');
  filtersForm.className = 'filters';

  var contaner = document.querySelector('.pictures');
  var loadedSomeShitFromServer = null;

  var nowFilter = 'filter-popular';

  var sortChecker = document.querySelectorAll('.filters-radio');

  for (var i = 0; i < sortChecker.length; i++) {
    sortChecker[i].onclick = function(evt) {
      console.log(evt.target.id);
      var sortCheckerID = evt.target.id;
      setFilter(sortCheckerID);
    };
  }


  getSomeShit();

/**
  * Загрузка данных
  */
  function getSomeShit() {
    contaner.classList.add('pictures-loading');

    var xhr = new XMLHttpRequest();

    xhr.open('get', 'http://o0.github.io/assets/json/pictures.json');
    xhr.timeout = 10000;

    xhr.onload = function(evt) {
      var firstShit = evt.target.response;
      loadedSomeShitFromServer = JSON.parse(firstShit);

      renderPictures(loadedSomeShitFromServer);
    };

    xhr.onerror = function() {
      contaner.classList.add('pictures-failure');
    };

    xhr.send();
  }

  /**
    * Отрисовка данных
    */
  function renderPictures(pictures) {
    contaner.innerHTML = '';

    pictures.forEach(function(pictureData) {
      var element = getElementFromTemplate(pictureData);
      contaner.appendChild(element);
    });
    contaner.classList.remove('pictures-loading');
  }

  function setFilter(id) {
    if (nowFilter === id) {
      return;
    }

    var sortedPictures = loadedSomeShitFromServer.slice(0); //copy

    switch (id) {
      case 'filter-new':
        sortedPictures = sortedPictures.sort(function(a, b) {
          return b.date - a.date;
        });
        nowFilter = 'filter-new';
        break;

      case 'filter-popular':
        sortedPictures = sortedPictures.sort(function(a, b) {
          return b.likes - a.likes;
        });
        nowFilter = 'filter-popular';
        break;

      case 'filter-discussed':
        sortedPictures = sortedPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        nowFilter = 'filter-discussed';
        break;
      default:

    }

    renderPictures(sortedPictures);
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
