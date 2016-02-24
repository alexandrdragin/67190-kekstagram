/**
 * @fileoverview
 * @author Igor Alexeenko и Alexandr Dragin
 */

'use strict';

define([
  'resizer',
  'cookies'
], function(Resizer, docCookies) {
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
   * @fileoverview
   * @author Alexandr Dragin
   */

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var resizer;
  var currentResizer;
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
   * @fileoverview
   * @author Igor Alexeenko (o0)
   */

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

    /**
     * сложим в куки
     * @param {String} key
     * @param {String} selectedFilter
     * @param {date} date
     */
    setCookieFun('filterInCookie', selectedFilter, exDate.toUTCString());

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
   * @param {String} key
   * @param {String} value
   * @param {date} expires
   */
  function setCookieFun(name, value, expires) {
    document.cookie = name + '=' + value + '; expires=' + expires;
  }

  /**
   * Доставалка из куки по ключу
   * @type {String}
   */
  var selectedFilterCookie = docCookies.getItem('filterInCookie');
  if (typeof (selectedFilterCookie) === 'string') {
    // установка лейбла в форме тру
    filterForm.querySelector('input[name="upload-filter"][value="' + selectedFilterCookie + '"]').checked = true;
    // фильтр на картинку из куки
    filterImage.className = 'filter-image-preview' + ' filter-' + selectedFilterCookie;
  }

  window.addEventListener('imagecreated', function() {
    imageConstraint = resizer.getConstraint();
    return imageConstraint;
  });

  /**
   * навеска
   */
  resizeForm.addEventListener('change', onResizeFormChange);
  function onResizeFormChange() {
    updateResizer();
  }

  /**
   * получение
   */
  function updateResizeForm() {
    resizeFormIsValid();
    if (currentResizer !== null) {
      var constraint = currentResizer.getConstraint();
      resizeForm.elements['resize-x'].value = Math.floor(constraint.x);
      resizeForm.elements['resize-y'].value = Math.floor(constraint.y);
      resizeForm.elements['resize-size'].value = Math.floor(constraint.side);
    }
  }

  /**
   * апдейт
   */
  function updateResizer() {
    resizeFormIsValid();
    if (currentResizer !== null) {
      currentResizer.setConstraint(+resizeForm.elements['resize-x'].value, +resizeForm.elements['resize-y'].value, +resizeForm.elements['resize-size'].value);
    }
  }

  window.addEventListener('resizerchange', updateResizeForm);

  cleanupResizer();
  updateBackground();

});
