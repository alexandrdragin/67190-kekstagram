/* global Resizer, docCookies: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var resizer;
  var currentResizer;
  var imageHeight;
  var imageWidth;
  var imageConstraint;

  var resizeControls = document.querySelector('.upload-resize-controls');
  //слева
  var resizeX = resizeControls.querySelector('input[name="x"]');
  //сверху
  var resizeY = resizeControls.querySelector('input[name="y"]');
  //сторона
  var resizeS = resizeControls.querySelector('input[name="size"]');

  resizeX.required = true;
  resizeY.required = true;
  resizeS.required = true;

  //установка времени для куки
  var now = new Date();
  var MY_LAST_BD = (1439510400); // 14 августа 2015
  var exDate = new Date(now.getTime() + MY_LAST_BD);


  //конец констант//////////////////////////

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {

    //размер фото
    var naturalWidth = currentResizer._image.naturalWidth;
    var naturalHeight = currentResizer._image.naturalHeight;
    // сохранение значеий как числа
    var yValue = +document.getElementById('resize-y').value;
    var sValue = +document.getElementById('resize-size').value;
    var xValue = +document.getElementById('resize-x').value;


    if ( ( (yValue + sValue) > naturalHeight) || ((xValue + sValue) > naturalWidth)) {
      //если нет меняем кнопку
      uploadFormFrw[0].setAttribute('disabled', true);
      uploadFormFrw[0].innerHTML = 'BAD SIZE';
      uploadFormFrw[0].style.color = 'red';
      uploadFormFrw[0].style.background = 'rgba(255, 255, 255, 0.2)';
      uploadFormFrw[0].style.url = '';

      setTimeout(backToBack, 2000);

      return false;
    }

    return true;
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @type {HTMLElement}
   */
  var uploadFormFrw = document.getElementsByClassName('upload-form-controls-fwd');

    /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */

  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */

  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */

  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {

      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */

  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */

  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    var selectedFilter = filterForm.querySelector('input[name="upload-filter"]:checked').value;

    setCookieFun('filterInCookie', selectedFilter, exDate.toUTCString());
    //document.cookie = 'filterInCookie' + '=' + selectedFilter + '; expires=' + exDate.toUTCString();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');

    filterForm.submit();
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */

  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

// восстановеление кнопки
  function backToBack() {
    uploadFormFrw[0].removeAttribute('disabled');
    uploadFormFrw[0].innerHTML = ' ';
    uploadFormFrw[0].style.color = 'buttontext';
    uploadFormFrw[0].style.background = 'rgba(255, 231, 83, 0.2)';
    uploadFormFrw[0].style.backgroundImage = 'url("img/icon-arrow.png")';
    uploadFormFrw[0].style.backgroundPosition = 'center';
    uploadFormFrw[0].style.backgroundRepeat = 'no-repeat';
  }

  /**
   *  Функиция записи в cookie
   */
  function setCookieFun(name, value, expires) {
    document.cookie = name + '=' + value + '; expires=' + expires;
  }

  var selectedFilterCookie = docCookies.getItem('filterInCookie');
  if (typeof (selectedFilterCookie) === 'string') {
    // лейбл
    filterForm.querySelector('input[name="upload-filter"][value="' + selectedFilterCookie + '"]').checked = true;
    // фильтр на картинку из куки
    filterImage.className = 'filter-image-preview' + ' filter-' + selectedFilterCookie;
  }

/////////////module6-task2 кастомное собите на перетасквивание фотки
/*
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  window.addEventListener('imagecreated', function() {

    imageConstraint = resizer.getConstraint();
    imageHeight = resizer.getImageSizeHeight();
    console.log(imageHeight);
    imageWidth = resizer.getImageSizeWidth();
    console.log(imageWidth);
    resizeS.value = imageConstraint.side;

    document.querySelector('.resize-image-preview').classList.add('invisible');

    resizeX.max = Math.max(imageWidth - resizeS.value, 0);
    resizeY.max = Math.max(imageHeight - resizeS.value, 0);
    resizeS.max = Math.min(imageWidth, imageHeight);

    resizeX.min = 0;
    resizeY.min = 0;
    resizeS.min = 50;

    resizeX.value = Math.floor(imageConstraint.x);
    resizeY.value = Math.floor(imageConstraint.y);
    resizeS.value = Math.floor(imageConstraint.side);
  });

  window.addEventListener('resizerchange', function() {
    clamp(Math.floor(imageConstraint.x), Math.floor(resizeX.min), Math.floor(resizeX.max));
    clamp(Math.floor(imageConstraint.y), Math.floor(resizeY.min), Math.floor(resizeY.max));
    imageConstraint = resizer.getConstraint();
    var x = (imageConstraint.x);
    var y = (imageConstraint.y);
    resizeX.value = x;
    resizeY.value = y;
    if (imageConstraint.x !== x || imageConstraint.y !== y) {
      resizer.setConstraint(x, y, Number(resizeS.value));
    }
  });

  resizeS.onchange = function() {
    resizeS.value = clamp(Number(resizeS.value), Number(resizeS.min), Number(resizeS.max));
    imageConstraint = resizer.getConstraint();
    var sideDiff = Math.floor((imageConstraint.side - Number(resizeS.value)) / 2);
    resizer.setConstraint(imageConstraint.x + sideDiff, imageConstraint.y + sideDiff, Number(resizeS.value));

    var picCanvas = document.querySelector('canvas');
    resizeX.max = Math.max(imageWidth - resizeS.value, 0);
    resizeY.max = Math.max(imageHeight - resizeS.value, 0);
    resizeS.max = Math.min(picCanvas.width, picCanvas.height);

    resizeS.value = Math.floor(imageConstraint.side);

    resizeX.value = Math.floor(imageConstraint.x);
    resizeY.value = Math.floor(imageConstraint.y);
  };

  resizeX.onchange = function() {
    resizeX.value = clamp(Number(resizeX.value), Number(resizeX.min), Number(resizeX.max));
    resizer.setConstraint(Number(resizeX.value), Number(resizeY.value), Number(resizeS.value));
  };

  resizeY.onchange = function() {
    resizeY.value = clamp(Number(resizeY.value), Number(resizeY.min), Number(resizeY.max));
    resizer.setConstraint(Number(resizeX.value), Number(resizeY.value), Number(resizeS.value));
  };

*/
///////////
  cleanupResizer();
  updateBackground();
})();
