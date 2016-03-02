/* global Photo, Gallery: true */

/**
 * @fileoverview
 * @author Alexandr Dragin
 */

'use strict';

(function() {

  /**
   * @type {HTMLElement}
   */
  var contaner = document.querySelector('.pictures');

  // появление блока с фильтрами
  var filtersForm = document.querySelector('form[class="filters hidden"]');
  filtersForm.className = 'filters';

  /**
   * хранит изначальное состояние данных сервера
   * @type {Array.<Object>}
   */
  var loadedSomeShitFromServer = null;
  var nowCreatedObjectPhoto = [];  //обьекты компанеты
  var sortedPictures = null;

  /**
   * всякое
   * @type {Number}
   */
  var currentPage = 0;
  var PAGE_SIZE = 12;

  /**
   * всякое
   * @const {Number}
   */
  var largeScreenSize = 1367; // размер широкого экрана
  var doThisShitOneTime = 1;

  /**
   * @type {gallery}
   */
  var gallery = new Gallery();

  /**
   * Доставалка из локалстореджа или по умолчанию
   * @type {String}
   */
  var nowFilter = (localStorage.getItem('filterInStorage') || 'filter-new');

  /**
   * подвеска для фильтров
   * @type {HTMLElement}
   */
  var sortChecker = document.querySelector('.filters');

  /**
   * Приклеивание на весь блок
   * но срабатывание по условию
   * @param {Event} evt
   */
  sortChecker.addEventListener('click', function(evt) {
    var clickedSortButton = evt.target;
    if (clickedSortButton.classList.contains('filters-radio') && (nowFilter !== clickedSortButton.id)) {
      setFilter(clickedSortButton.id);
    }
  });

  /**
   * тротлим скрол
   * @type {Object}
   */
  var trottle;

  window.addEventListener('scroll', function() {
    clearTimeout(trottle); // пока скролю функция на паузе
    trottle = setTimeout(function() {

      /**
       * параметры экрана
       * @const {Number}
       */
      var viewportSize = window.innerHeight; // размер экрана
      var totalHeight = document.body.clientHeight; // страница целиком
      var topBorderPage = window.scrollY;// докуда проскролил
      var PILLOW = 100;

      if (totalHeight < viewportSize + topBorderPage + PILLOW) {
        renderPictures(sortedPictures, ++currentPage, false);
      }
    }, 500); // время между тротлами
  });

/**
  * Загрузка данных
  */
  getSomeShit();

  function getSomeShit() {
    contaner.classList.add('pictures-loading'); // прелоадер

    var xhr = new XMLHttpRequest(); // база

    xhr.open('get', 'http://o0.github.io/assets/json/pictures.json');
    xhr.timeout = 10000;

    xhr.onload = function(evt) {
      loadedSomeShitFromServer = JSON.parse(evt.target.response);

      setFilter(nowFilter);
      var nowFilterHash = '#' + nowFilter;
      sortChecker.querySelector(nowFilterHash).checked = true;
    };

    xhr.onerror = function() {
      contaner.classList.add('pictures-failure');
    };

    xhr.send(); // важно
  }

  /**
   * отрисовка списка фотографий
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

    /**
     * механика перетирания содержимого страницы
     * @type {Array}
     */
      var elem;
      while ((elem = nowCreatedObjectPhoto.shift())) { // уничтожение по 1 до 0
        contaner.removeChild(elem.element);
        elem.onClick = null;
        elem.remove();
      }
    }

    /**
      * На широких эранах при зарузке размер страницы будет + 8
      */
    if (document.body.clientWidth > largeScreenSize && pageNumber === 0 && doThisShitOneTime === 1) {
      PAGE_SIZE = PAGE_SIZE + 8;
      doThisShitOneTime = 0;
    }

    /**
     * от текщей страницы на размер до плюс размер страницы
     * @type {Number}
     */
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    /**
     * безопасная выборка арея
     * @param {number} from
     * @param {number} to
     */
    var numberPicutersOnPage = pictures.slice(from, to);
    var fragment = document.createDocumentFragment();

      //конкатинация массивов скеиванием
    nowCreatedObjectPhoto = nowCreatedObjectPhoto.concat(numberPicutersOnPage.map(function(pictureData) {
      var photoElement = new Photo(pictureData);

      photoElement.render(); // метод из photo.js по отрисовке одного
      fragment.appendChild(photoElement.element); // приклеивание

      // и довеса на этот элемнт онклика по отрвки даты в gallery.js
      photoElement.onClick = function() {
        gallery.data = photoElement._data; // отправка даты в галлерею
        gallery.show(); // покажись
      };

      return photoElement; // незнаю зачем здесь это
    }));

    contaner.appendChild(fragment);


  /**
    * метод из галлереии по отравки Photo в нее же
    * причем тут это уже дом элементы а не просто данные
    */
    gallery.setPhotos(nowCreatedObjectPhoto);

    // убираем прелоадер
    contaner.classList.remove('pictures-loading');
  }

  /**
   * фильтруха. всегда принимает nowFilter или айдишкик по клику
   * @param {String} id
   */
  function setFilter(id) {
    currentPage = 0;

    sortedPictures = loadedSomeShitFromServer.slice(0); //safe copy

    // в случае
    switch (id) {
      case 'filter-new':
        sortedPictures = sortedPictures.sort(function(a, b) {
          return b.date - a.date; // чем больше тем выше
        });
        nowFilter = 'filter-new'; // запоминаем что наделали
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

    /**
     * отрисовка отфильрованных фотографий
     * @param {Array.<Object>} reviewsToRender
     * @param {number} pageNumber
     * @param {boolean=} replace всегда true потому что замена
     */
    renderPictures(sortedPictures, 0, true);

    /**
     * забивка в стор
     * @param {String} key
     * @param {String} nowFilter
     */
    localStorage.setItem('filterInStorage', nowFilter);
  }

})();
