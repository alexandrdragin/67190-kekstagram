/* global pictures: true */

'use strict';

(function() {

  var filtersForm = document.querySelector('form[class="filters hidden"]');
  filtersForm.className = 'filters';

  var contaner = document.querySelector('.pictures');

  pictures.forEach(function(pictureData) {
    var element = getElementFromTemplate(pictureData);
    contaner.appendChild(element);
  });

  function getElementFromTemplate(data) {

    var template = document.querySelector('#picture-template');

    if ('content' in template) {
      var element = template.content.children[0].cloneNode(true);
    } else {
      var element = template.children[0].cloneNode(true);
    }

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    element.querySelector('IMG').src = data.url;

//    var backgroundImage = new Image();
  //  backgroundImage.src = data.url;

  //"likes": 100,
  //"comments": 11,
  //"url": "photos/26.mp4",   < src
  //"preview": "photos/26.jpg",
  //"date": "2016-01-06"

/*
    <a href="" class="picture">
      <img src="" width="182" height="182">
      <span class="picture-stats">
        <span class="picture-stat picture-comments"></span>
        <span class="picture-stat picture-likes"></span>
      </span>
    </a>
*/
    return element;
  }

})();
