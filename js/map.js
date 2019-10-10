'use strict';

(function () {
  var PIN_COUNT = 5;
  var URL_SAVE = 'https://js.dump.academy/keksobooking';
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';

  var mainPinOffsetX = 32;
  var mainPinOffsetYActive = 70;
  var mainPinOffsetYPassive = 32;
  var mapPins = document.querySelector('.map__pins');
  var map = window.data.map;
  var filterForm = window.data.filterForm;
  var mainPin = map.querySelector('.map__pin--main');
  var mainPinPosition = document.querySelector('#address');
  var adForm = window.data.adForm;

  var defautPinPosition = {
    'x': mainPin.style.left,
    'y': mainPin.style.top,
  };

  var arrayOfPins;

  var renderAllPins = function (container, arrayPins) {
    var fragment = document.createDocumentFragment();
    var takeNumber = arrayPins.length > PIN_COUNT ? PIN_COUNT : arrayPins.length;
    for (var i = 0; i < takeNumber; i++) {
      fragment.appendChild(window.pin.renderPinAttributs(arrayPins[i]));
    }
    container.appendChild(fragment);
  };

  var getMainPinPosition = function () {
    var offsetY = map.classList.contains('map--faded') ? mainPinOffsetYPassive : mainPinOffsetYActive;
    var position = {
      'x': mainPin.offsetLeft + mainPinOffsetX,
      'y': mainPin.offsetTop + offsetY,
    };
    return position;
  };

  var setMainPinPosition = function () {
    var position = getMainPinPosition();
    mainPinPosition.value = position.x + ', ' + position.y;
  };

  var setActiveState = function () {
    if (map.classList.contains('map--faded')) {
      window.backend.ajax(onLoad, onError, 'GET', URL_LOAD);
    }
  };

  var setPassiveState = function () {
    adForm.reset();
    filterForm.reset();
    map.classList.toggle('map--faded');
    adForm.classList.toggle('ad-form--disabled');
    window.util.setFormStatus(filterForm, true);
    window.util.setFormStatus(adForm, true);
    window.data.deletePins();
    window.card.closePopup();
    mainPin.style.left = defautPinPosition.x;
    mainPin.style.top = defautPinPosition.y;
    setMainPinPosition();
    window.form.getHousingPrice();
    window.form.renderCapacity();
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    setActiveState();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var endCoords = {
        x: getMainPinPosition().x - shift.x,
        y: getMainPinPosition().y - shift.y
      };

      if ((endCoords.x >= window.data.LOCATION_X_MIN) && (endCoords.x <= window.data.LOCATION_X_MAX)) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }

      if ((endCoords.y >= window.data.LOCATION_Y_MIN) && (endCoords.y <= window.data.LOCATION_Y_MAX)) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }

      window.form.getHousingPrice();
      window.form.renderCapacity();
      setMainPinPosition();

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, setActiveState);
  });

  var filterPins = function (type) {

    window.data.deletePins();
    window.card.closePopup();
    var sameTypePine = arrayOfPins;

    if (!(type === 'any')) {
      sameTypePine = arrayOfPins.filter(function (it) {
        return it.offer.type === type;
      });
    }

    renderAllPins(mapPins, sameTypePine);
  };

  var housingType = document.querySelector('#housing-type');

  housingType.addEventListener('change', function () {
    var type = window.form.getActiveSelectOptionValue(housingType);
    filterPins(type);
  });

  // загрузка данных

  var onLoad = function (data) {
    window.util.setFormStatus(filterForm, false);
    window.util.setFormStatus(adForm, false);
    map.classList.toggle('map--faded');
    setMainPinPosition();
    adForm.classList.toggle('ad-form--disabled');
    arrayOfPins = data;
    renderAllPins(mapPins, arrayOfPins);
  };

  var onError = function (errorMessage) {
    window.message.showMessage(errorMessage);
  };

  var onSend = function () {
    window.message.showMessage();
    setPassiveState();
  };

  // Отправка данных
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.ajax(onSend, onError, 'POST', URL_SAVE, new FormData(adForm));
  });

  var resetButton = adForm.querySelector('.ad-form__reset');

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    setPassiveState();
  });

  setMainPinPosition();
  window.util.setFormStatus(filterForm, true);
  window.util.setFormStatus(adForm, true);
  window.form.getHousingPrice();
  window.form.renderCapacity();

})();
