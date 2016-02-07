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

  var sortedPictures = null;
  var currentPage = 0;
  var PAGE_SIZE = 12; // педж сайз

  var nowFilter = 'filter-popular';

//подвеска для фильтров
  var sortChecker = document.querySelectorAll('.filters-radio');//-all

  for (var i = 0; i < sortChecker.length; i++) {
    sortChecker[i].onclick = function(evt) {
      console.log(evt.target.id);
      var sortCheckerID = evt.target.id;
      setFilter(sortCheckerID);
    };
  }

  var trottle;

//он лоад?
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

      var largeScreenSize = 1367;

      if (document.body.clientWidth > largeScreenSize) {
        var addScrollData = sortedPictures || loadedSomeShitFromServer;
        renderPictures(addScrollData, ++currentPage, false);
      } // еще есть кейс когда после 1 загрузки растянули окно
        // знаю как сделать но чет лень()
        // нужно повесить событие на он чаниж виндоу с тротлм
        // и если currentPage = 0 тогда еще подгруз.
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
      contaner.innerHTML = '';
    }
    //
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var numberPicutersOnPage = pictures.slice(from, to);

    numberPicutersOnPage.forEach(function(pictureData) {
      var element = getElementFromTemplate(pictureData);
      contaner.appendChild(element);
    });
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

  function getElementFromTemplate(data) {

    var template = document.querySelector('#picture-template');

// проверка браузера
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
    }

    return element;

  }

})();
