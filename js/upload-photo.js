'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var adForm = window.data.adForm;
  var fileChooserAvatar = adForm.querySelector('#avatar');
  var userAvatar = adForm.querySelector('.ad-form-header__preview img');
  var avatarDefault = userAvatar.src;

  var photoContainer = adForm.querySelector('.ad-form__photo-container');
  var fileChooserPhotos = photoContainer.querySelector('.ad-form__upload input[type=file]');
  var userPhoto = photoContainer.querySelector('.ad-form__photo');

  var chooseAvatar = function (result) {
    userAvatar.src = result;
  };

  var createUserPhoto = function (result) {
    var imgContainer = userPhoto.cloneNode(true);
    imgContainer.classList.add('ad-form__photo--js');
    var newPhoto = document.createElement('img');
    newPhoto.style.width = '100%';
    newPhoto.style.height = '100%';
    newPhoto.classList.add('ad-form__photo-img');
    newPhoto.src = result;
    newPhoto.alt = 'Фотография жилья';
    imgContainer.appendChild(newPhoto);
    photoContainer.insertBefore(imgContainer, userPhoto);
  };

  var clearPhotoUpload = function () {
    userAvatar.src = avatarDefault;
    var uploadedPhotos = photoContainer.querySelectorAll('.ad-form__photo--js');
    if (uploadedPhotos) {
      uploadedPhotos.forEach(function (photo) {
        photo.parentNode.removeChild(photo);
      });
    }
  };

  var chooseFile = function (fileUploader, action) {
    fileUploader.addEventListener('change', function () {
      var file = fileUploader.files[0];
      if (file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });
      }

      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          action(reader.result);
        });
        reader.readAsDataURL(file);
      }
    });
  };

  chooseFile(fileChooserAvatar, chooseAvatar);
  chooseFile(fileChooserPhotos, createUserPhoto);

  window.uploadPhoto = {
    clear: clearPhotoUpload,
  };
})();
