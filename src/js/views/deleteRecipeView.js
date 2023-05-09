'use strict';
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class DeleteRecipeView extends View {
  _parentElement = document.querySelector('.delete-recipe-window');
  _openBtnParent = document.querySelector('.recipe');
  _overlay = document.querySelector('.overlay-delete');
  _btnOpen = document.querySelector('.btn--delete');
  _btnClose = document.querySelector('.close-popup-btn');
  _btnDelete = document.querySelector('.popup-delete-btn');

  _message = 'Recipe was successfully deleted :)';
  // ID storage
  _recipeId = '';

  constructor() {
    super();
    this._showWindow();
    this._hideWindow();
  }

  render(id, title) {
    const markup = this._generateMarkup(title);
    this._recipeId = id;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.popup-delete-btn');
        if (!btn) return;
        handler(this._recipeId);
      }.bind(this)
    );
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._parentElement.classList.toggle('hidden');
  }

  _showWindow() {
    this._openBtnParent.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.btn--delete');
        if (!btn) return;

        this.render(btn.dataset.id, btn.dataset.name);
        this.toggleWindow();
      }.bind(this)
    );
  }

  _hideWindow() {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.close-popup-btn');
        if (!btn) return;

        this.toggleWindow();
      }.bind(this)
    );
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _generateMarkup(title) {
    return `<div>
        <h1>Are you sure you want to delete recipe - "${title}"?</h1>
        <div class="delete-popup-buttons">
            <button class="popup-delete-btn">YES</button>
            <button class="close-popup-btn">NO</button>
        </div>
    </div>`;
  }
}

export default new DeleteRecipeView();
