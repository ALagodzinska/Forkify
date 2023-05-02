'use strict';
import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { MEASURE_UNITS } from '../config.js';

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
        this.render();
        this.toggleWindow();
      }.bind(this)
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // array with all fields and values
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  _generateMarkup() {
    return `<form class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input required name="title" type="text" />
          <label>URL</label>
          <input required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input required name="image" type="text" />
          <label>Publisher</label>
          <input required name="publisher" type="text" />
          <label>Prep time</label>
          <input required name="cookingTime" type="number" />
          <label>Servings</label>
          <input required name="servings" type="number" />
        </div>

        <div>
          <h3 class="upload__heading">Add ingredients:</h3>
          <div>
            <div class="input-group">
              <input
                type="number"
                class="form-control ingredient-number"
                placeholder="QTY"
              />

              <select class="custom-select" id="inputGroupSelect">
                <option selected disabled>UNIT</option>
                ${this._generateMarkupForUnits()}
              </select>

              <input
                type="text"
                class="form-control ingredient-name"
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
          <div class="ingredient-list">
            <ul></ul>
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
