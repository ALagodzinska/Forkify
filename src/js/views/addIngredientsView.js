'use strict';
import icons from 'url:../../img/icons.svg';

const displayIngredientError = function (element, message) {
  element.innerHTML = '';
  element.innerHTML = `${message}`;
  element.parentElement.classList.remove('hidden');
};

const hideIngredientError = function (element) {
  element.innerHTML = '';
  element.parentElement.classList.add('hidden');
};

const addErrorClass = function (inputElement) {
  inputElement.classList.add('is-invalid');
  inputElement.style.borderColor = '#dc3545';
};

const removeErrorClass = function (inputElement) {
  inputElement.classList.remove('is-invalid');
  inputElement.style.borderColor = '#ddd';
};

const generateMarkup = function (ingredient) {
  return `<li class="list-group-item ingredient-from-list">${
    ingredient.quantity !== 0 ? ingredient.quantity : ''
  } ${ingredient.unit} ${
    ingredient.description
  } <button class="remove-ingredient-btn" data-id="${ingredient.id}"><svg>
            <use href="${icons}#icon-remove-ingredient"></use>
          </svg></button></li>`;
};

export const getIngredientData = function () {
  const qtyField = document.querySelector('.ingredient-number');
  const unitField = document.getElementById('inputGroupSelect');
  const nameField = document.querySelector('.ingredient-name');

  const errorField = document.querySelector('.ingredient-error');

  const ingredientQty = +qtyField.value;
  const ingredientUnits = unitField.value;
  const ingredientName = nameField.value;

  // Add data validation
  // Display error on screen and return
  if (!ingredientName.trim()) {
    displayIngredientError(errorField, 'You are missing ingredient name!');
    addErrorClass(nameField);
    return;
  } else if (ingredientQty < 0) {
    displayIngredientError(errorField, 'Quantity should be a positive number!');
    addErrorClass(qtyField);
    removeErrorClass(nameField);
    return;
  } else if (ingredientUnits && ingredientQty === 0) {
    displayIngredientError(
      errorField,
      'Please input ingredient quantity for selected unit!'
    );
    addErrorClass(qtyField);
    removeErrorClass(nameField);
    return;
  }

  // clear input fields
  qtyField.value = '';
  unitField.value = '';
  nameField.value = '';
  // clear errors
  hideIngredientError(errorField);
  // remove error class
  const allInvalidInputs = document.querySelectorAll(
    '.ingredient-input-bar .is-invalid'
  );
  [...allInvalidInputs].forEach(removeErrorClass);
  // remove error from list window
  hideIngredientError(document.querySelector('.ingredient-list-error'));
  document
    .querySelector('.ingredient-list')
    .classList.remove('empty-list-error');

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

export const checkIfIngredientsListIsEmpty = function (list) {
  const errorField = document.querySelector('.ingredient-list-error');
  const listField = document.querySelector('.ingredient-list');

  if (list.length === 0 || !list) {
    // Add Error and display it
    displayIngredientError(
      errorField,
      'You need to add at least one ingredient!'
    );
    listField.classList.add('empty-list-error');
    return true;
  } else {
    hideIngredientError(errorField);
    listField.classList.remove('empty-list-error');
    return false;
  }
};
