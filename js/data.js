'use strict';

(function () {
  var TYPE_OF_HOUSE = {
    'palace': {
      'text': 'Дворец',
      'minPrice': 10000,
    },
    'house': {
      'text': 'Дом',
      'minPrice': 5000,
    },
    'flat': {
      'text': 'Квартира',
      'minPrice': 1000,
    },
    'bungalo': {
      'text': 'Бунгало',
      'minPrice': 0,
    },
  };

  var map = document.querySelector('.map');
  var filterForm = map.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');

  var deletePins = function () {
    [].forEach.call(map.querySelectorAll('.map__pin:not(.map__pin--main)'), function (pin) {
      pin.parentNode.removeChild(pin);
    });
  };

  var clearPins = function () {
    var activePin = map.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  window.data = {
    map: map,
    filterForm: filterForm,
    adForm: adForm,
    deletePins: deletePins,
    clearPins: clearPins,
    TYPE_OF_HOUSE: TYPE_OF_HOUSE,
    OFFSET_X: 25,
    OFFSET_Y: 70,
    LOCATION_X_MIN: 0,
    LOCATION_X_MAX: 1200,
    LOCATION_Y_MIN: 130,
    LOCATION_Y_MAX: 630,
  };
})();
