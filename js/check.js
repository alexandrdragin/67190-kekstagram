var a, b;

function getMessage (a, b) {

  // Если первый аргумент, a, имеет тип boolean, то:
  if (typeof a === "boolean") {

    console.log("boolean");

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

    console.log("a = object, png");
    console.log(a); // [23, 11, 75, 88, 14]
    console.log(a.length); // [5]

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
    var sumA = 0;
    var sumB = 0;

    for (var i = 0; i < a.length; i++) {
      sumA += a[i];
    };

    for (var i = 0; i < b.length; i++) {
      sumB += b[i];
    };

    square = sumA * sumB;

    console.log(square);

    //console.log("square =" square);
    return "Общая площадь артефактов сжатия: " + square + " пикселей";
  };

};
