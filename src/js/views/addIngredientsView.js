'use strict';
import icons from 'url:../../img/icons.svg';

const displayIngredientError = function (message) {
  const errorField = document.querySelector('.ingredient-error');

  errorField.innerHTML = '';
  errorField.innerHTML = `* ${message}`;
  errorField.parentElement.classList.remove('hidden');
};

const hideIngredientError = function () {
  const errorField = document.querySelector('.ingredient-error');

  errorField.innerHTML = '';
  errorField.parentElement.classList.add('hidden');
};

const addErrorClass = function (inputElement) {
  inputElement.classList.add('is-invalid');
};

const removeErrorClass = function (inputElement) {
  inputElement.classList.remove('is-invalid');
};

const generateMarkup = function (ingredient) {
  return `<li class="list-group-item ingredient-from-list">${
    ingredient.qty !== 0 ? ingredient.qty : ''
  } ${ingredient.unit} ${
    ingredient.name
  } <button class="remove-ingredient-btn" data-id="${ingredient.id}"><svg>
            <use href="${icons}#icon-remove-ingredient"></use>
          </svg></button></li>`;
};

export const getIngredientData = function () {
  const qtyField = document.querySelector('.ingredient-number');
  const unitField = document.getElementById('inputGroupSelect');
  const nameField = document.querySelector('.ingredient-name');

  const ingredientQty = +qtyField.value;
  const ingredientUnits = unitField.value;
  const ingredientName = nameField.value;

  // Add data validation
  // Display error on screen and return
  if (!ingredientName.trim()) {
    displayIngredientError('You are missing ingredient name!');
    addErrorClass(nameField);
    return;
  } else if (ingredientQty < 0) {
    displayIngredientError('Quantity should be a positive number!');
    addErrorClass(qtyField);
    removeErrorClass(nameField);
    return;
  } else if (ingredientUnits && ingredientQty === 0) {
    displayIngredientError(
      'Please input ingredient quantity for selected unit!'
    );
    addErrorClass(unitField);
    removeErrorClass(nameField);
    return;
  }

  // clear input fields
  qtyField.value = '';
  unitField.value = '';
  nameField.value = '';
  // clear errors
  hideIngredientError();
  // remove error class
  const allInvalidInputs = document.querySelectorAll(
    '.ingredient-input-bar .is-invalid'
  );
  [...allInvalidInputs].forEach(removeErrorClass);

  return [ingredientQty, ingredientUnits, ingredientName];
};

export const displayNewIngredient = function (ingredient) {
  // Add ingredient to a list
  const markup = generateMarkup(ingredient);

  // inset to a list
  document
    .querySelector('.ingredients')
    .insertAdjacentHTML('afterbegin', markup);
};

export const displayIngredients = function (ingredients) {
  const listField = document.querySelector('.ingredients');
  //clear
  listField.innerHTML = '';
  ingredients.forEach(ingredient => {
    displayNewIngredient(ingredient);
  });
};
