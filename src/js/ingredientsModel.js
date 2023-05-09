'use strict';
import { v4 as uuidv4 } from 'uuid';

export const ingredientList = [];

export const createIngredientObject = function (qty, unit, name) {
  const ingredient = {
    id: uuidv4(),
    quantity: qty,
    unit: unit,
    description: name,
  };

  ingredientList.push(ingredient);

  return ingredient;
};

export const clearIngredientsArray = function () {
  ingredientList = [];
};
