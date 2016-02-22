/* global Photo, Gallery: true */

'use strict';

(function() {

  var contaner = document.querySelector('.pictures');

  // появление блока с фильтрами
  var filtersForm = document.querySelector('form[class="filters hidden"]');
  filtersForm.className = 'filters';

  /**
   * хранит изначальное состояние данных ссервера
   * @type {Array.<Object>}
   */
  var loadedSomeShitFromServer = null;
  var nowCreatedObjectPhoto = [];  //обьекты компанеты
  var sortedPictures = null;
  var currentPage = 0;
  var PAGE_SIZE = 12;

  var largeScreenSize = 1367; // размер широкого экрана
  var doThisShitOneTime = 1;

  var gallery = new Gallery();

  var nowFilter = 'filter-new';

//подвеска для фильтров
  var sortChecker = document.querySelector('.filters');
  sortChecker.addEventListener('click', function(evt) {
    var clickedSortButton = evt.target;
    if (clickedSortButton.classList.contains('filters-radio')) {
      setFilter(clickedSortButton.id);
    }
  });

  var trottle;

  window.addEventListener('scroll', function() {
    clearTimeout(trottle); // пока скролю функция на паузе
    trottle = setTimeout(function() {

      var viewportSize = window.innerHeight; // размер экрана
      var totalHeight = document.body.clientHeight; // страница целиком
      var topBorderPage = window.scrollY;// докуда проскролил
      var PILLOW = 100;
      if (totalHeight < viewportSize + topBorderPage + PILLOW) {
        var addScrollData = sortedPictures || loadedSomeShitFromServer;
        renderPictures(addScrollData, ++currentPage, false);
      }
    }, 500);
  });

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

      renderPictures(loadedSomeShitFromServer, 0);
      sortChecker.querySelector('#filter-new').checked = true;

    };

    xhr.onerror = function() {
      contaner.classList.add('pictures-failure');
    };

    xhr.send();
  }

  /**
   * отрисовка списокf фотографий
   * @param {Array.<Object>} reviewsToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderPictures(pictures, pageNumber, replace) {

    // проверям тип переменной + тернарный оператор(что делать если ? выполняться: нет;)
    replace = typeof replace !== 'undefined' ? replace : true;
    // нормализация документа(горантирует содержание)
    pageNumber = pageNumber || 0;

    if (replace) {
      var elem;
      while ((elem = nowCreatedObjectPhoto.shift())) { // уничтожение по 1
        contaner.removeChild(elem.element);
        elem.onClick = null;
        elem.remove();
      }
    }

    if (document.body.clientWidth > largeScreenSize && pageNumber === 0 && doThisShitOneTime === 1) {
      PAGE_SIZE = PAGE_SIZE + 8;
      doThisShitOneTime = 0;
    }

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var numberPicutersOnPage = pictures.slice(from, to);

      //конкатинация массивов скеиванием
    nowCreatedObjectPhoto = nowCreatedObjectPhoto.concat(numberPicutersOnPage.map(function(pictureData) {
      var photoElement = new Photo(pictureData);
      //photoElement.setData(pictureData);
      photoElement.render();
      contaner.appendChild(photoElement.element);

      photoElement.onClick = function() {
        gallery.data = photoElement._data; // отправка даты в галлерею
        gallery.show();
      };

      return photoElement;
    }));

    //console.dir(nowCreatedObjectPhoto);
    //console.log(nowCreatedObjectPhoto.length);

    //метод из галлереии по отравки Photo в нее же
    gallery.setPhotos(nowCreatedObjectPhoto);

    contaner.classList.remove('pictures-loading');
  }

  function setFilter(id) {
    currentPage = 0;
    if (nowFilter === id) {
      return;
    }

    sortedPictures = loadedSomeShitFromServer.slice(0); //copy

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

    renderPictures(sortedPictures, 0, true);
  }

})();
