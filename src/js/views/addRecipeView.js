'use strict';
import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { MEASURE_UNITS } from '../config.js';
import {
  getIngredientData,
  checkIfIngredientsListIsEmpty,
} from './addIngredientsView.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay-add');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  render() {
    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  hideWindow() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      'click',
      function () {
        this._parentElement.classList.remove('was-validated');
        this.render();
        this.toggleWindow();
      }.bind(this)
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerAddIngredient(handler) {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.add-ingredient-btn');
        if (!btn) return;
        handler(getIngredientData());
      }.bind(this)
    );
  }

  addHandlerRemoveIngredient(handler) {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        const btn = e.target.closest('.remove-ingredient-btn');
        if (!btn) return;
        handler(btn.dataset.id);
      }.bind(this)
    );
  }

  addHandlerUpload(handler, getIngredients) {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.upload__btn');
        if (!btn) return;

        // get ingredients
        const ingredients = getIngredients();
        const isEmptyList = checkIfIngredientsListIsEmpty(ingredients);

        // Validate form fields if error return
        if (!this._parentElement.checkValidity() || isEmptyList) {
          e.preventDefault();
          e.stopPropagation();

          this._parentElement.classList.add('was-validated');
          return;
        }

        this._parentElement.classList.add('was-validated');

        // array with all fields and values
        const dataArray = [...new FormData(this._parentElement)];
        const data = Object.fromEntries(dataArray);
        data.ingredients = ingredients;

        handler(data);
      }.bind(this)
    );
  }

  _generateMarkup() {
    return `<form class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <div class="input-element">
            <label>Title</label>
            <div>
              <input required name="title" type="text" class="form-control" />
              <div class="invalid-feedback">
                Please input recipe name.
              </div>
            </div>
          </div>
          <div class="input-element">
            <label>URL</label>
            <div>
              <input required name="sourceUrl" type="url" class="form-control" />
              <div class="invalid-feedback">
                Please input correct source link.
              </div>
            </div>
          </div>
          <div class="input-element">
            <label>Image URL</label>
            <div>
              <input required name="image" type="url" class="form-control" />
              <div class="invalid-feedback">
                Please input correct image link.
              </div>
            </div>
          </div>
          <div class="input-element">
            <label>Publisher</label>
            <div>
              <input required name="publisher" type="text" class="form-control" />
              <div class="invalid-feedback">
                Please publisher name.
              </div>
            </div>
          </div>
          <div class="input-element">
            <label>Prep time</label>
            <div>
              <input required name="cookingTime" min="1" type="number" class="form-control" />
              <div class="invalid-feedback">
                Please input valid preparation time.
              </div>
            </div>
          </div>
          <div class="input-element">
            <label>Servings</label>
            <div>
              <input required name="servings" min="1" type="number" class="form-control" />
              <div class="invalid-feedback">
                Please input valid serving count.
              </div>
            </div>
          </div>
        </div>

        <div class="ingredient-input-bar">
          <h3 class="upload__heading">Add ingredients:</h3>
          <div>
            <div class="input-group">
              <input
                type="number"
                class="ingredient-number"
                min="0"
                placeholder="QTY"
              />

              <select class="custom-select" id="inputGroupSelect">
                <option value="" selected disabled hidden>UNIT</option>
                ${this._generateMarkupForUnits()}
              </select>

              <input
                type="text"
                class="ingredient-name"
                placeholder="Name of ingredient..."
              />

              <div class="input-group-append">
                <button
                  class="btn--round add-ingredient-btn"
                  type="button"
                >
                <svg>
                      <use href="${icons}#icon-add"></use>
                  </svg>
                  </button>
              </div>
            </div>
          </div>
          <div class="ingredient-validation">
            <span class="ingredient-error"></span>
          </div>
          <div class="ingredient-list">    
            <ul class="ingredients list-group"></ul>
          </div>
          <div class="ingredient-list-validation">
            <span class="ingredient-list-error"></span>
          </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      </form>`;
  }

  _generateMarkupForUnits() {
    return MEASURE_UNITS.map(
      unit => `<option value="${unit}">${unit}</option>`
    ).join('');
  }
}

export default new AddRecipeView();
