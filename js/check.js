var a, b;

function getMessage (a, b) {

  // Если первый аргумент, a, имеет тип boolean, то:
  if (typeof a === "boolean") {

    if (a == true) {
     return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    }
    else {
       return "Переданное GIF-изображение не анимировано";
    }
  };

  // Если первый аргумент имеет числовой тип, то вернуть строку:
  if (typeof a === "number") {

    return ("Переданное SVG-изображение содержит " + a + " объектов и " + (b * 4) + " аттрибутов");
  }


  // Если первый аргумент массив, то вернуть строку:
  if (typeof a === "object" && typeof b === "undefined") {

    var sum = 0;

    for (var i = 0; i < a.length; i++) {
      sum += a[i];
    };

    //"Количество красных точек во всех строчках изображения: " + sum + ".";
    return "Количество красных точек во всех строчках изображения: " + sum + ".";
  };

  // Если оба аргумента массивы, то вернуть строку:
  if (typeof a === "object" && typeof b === "object") {

  var square = 0;
    if (a.length === b.length) {
      for (var i = 0; i < a.length; i++) {
        square += a[i] * b[i];
      }
    }

    //console.log("square =" square);
    return "Общая площадь артефактов сжатия: " + square + " пикселей";
  };

};
