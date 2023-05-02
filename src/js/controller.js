import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import deleteRecipeView from './views/deleteRecipeView.js';

// import icons from '../img/icons.svg'; // Parcel 1
// returns link to icons file from dist folder
// import icons from 'url:../img/icons.svg'; // Parcel 2
import 'core-js/stable'; // polyfilled everything else
import 'regenerator-runtime/runtime'; // polyfilled async await
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update Results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1) Update bookmarks
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEWinitial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlDeleteRecipe = async function (recipeId) {
  // Show Loading spinner
  deleteRecipeView.renderSpinner();

  // Remove recipe
  await model.deleteRecipe(recipeId);

  // Change URL without reload
  window.history.replaceState(null, null, '/');

  // Success message
  deleteRecipeView.renderMessage();

  //Update Bookmarks
  model.removeElement(recipeId, model.state.bookmarks);
  bookmarksView.render(model.state.bookmarks);

  // Update Search Bar
  model.removeElement(recipeId, model.state.search.results);
  resultsView.render(model.getSearchResultsPage());
  // Render initial pagination buttons
  paginationView.render(model.state.search);

  // Update Recipe view
  recipeView.renderMessage();

  // Close form window
  setTimeout(function () {
    deleteRecipeView.toggleWindow();
  }, MODAL_CLOSE_SEC * 1000);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    // change url without reloading page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // go back to last page
    // window.history.back();

    // Close form window
    setTimeout(function () {
      addRecipeView.hideWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  //publisher subscriber pattern
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  deleteRecipeView.addHandlerDelete(controlDeleteRecipe);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
