import { async } from 'regenerator-runtime';
import { NUTRIENT_API_URL, NUTRIENT_KEY } from './config.js';
import { AJAX } from './helpers.js';

export const getRecipeNutrients = async function (ingredientList) {
  try {
    // map list to receive list of nutrients, count all together
    const asyncRes = await Promise.all(
      ingredientList.map(async ingr => {
        const nutrientData = await findIngredient(ingr);
        // count percents in calories
        countCaloricBreakdown(
          nutrientData.caloricBreakdown,
          nutrientData.totalCalories
        );
        return nutrientData;
      })
    );
    // reduce to total value
    const totalCaloriesCount = asyncRes.reduce((prevValue, currentValue) => {
      return {
        totalCalories: prevValue.totalCalories + currentValue.totalCalories,
        protein: +(
          prevValue.caloricBreakdown.percentProtein +
          currentValue.caloricBreakdown.percentProtein
        ).toFixed(1),
        fat: +(
          prevValue.caloricBreakdown.percentFat +
          currentValue.caloricBreakdown.percentFat
        ).toFixed(1),
        carbs: +(
          prevValue.caloricBreakdown.percentCarbs +
          currentValue.caloricBreakdown.percentCarbs
        ).toFixed(1),
      };
    });

    totalCaloriesCount.protein = getPercentage(
      totalCaloriesCount.protein,
      totalCaloriesCount.totalCalories
    );
    totalCaloriesCount.fat = getPercentage(
      totalCaloriesCount.fat,
      totalCaloriesCount.totalCalories
    );
    totalCaloriesCount.carbs = getPercentage(
      totalCaloriesCount.carbs,
      totalCaloriesCount.totalCalories
    );

    return totalCaloriesCount;
  } catch (err) {
    console.log(`${err} 💩`);
    // Hide div with calories
    // document.querySelector('.recipe__calories').style.display = 'none';
  }
};

export const findIngredient = async function (ingredient) {
  try {
    // check if item already exists
    const itemFromLocalStorage = localStorage.getItem(ingredient.description);
    if (itemFromLocalStorage) {
      return JSON.parse(itemFromLocalStorage);
    }
    // boolean to see if ingredient was found
    let found = false;
    // store query to reduce it if ingredient was not found
    let title = ingredient.description;
    while (!found) {
      const urlTileString = title.split(' ').join('%20');
      const { results } = await AJAX(
        `${NUTRIENT_API_URL}search?query=${urlTileString}&apiKey=${NUTRIENT_KEY}`
      );

      if (results && results.length > 0) {
        // take first elements data
        const id = results[0].id;
        // get nutrition data
        const nutrition = await getIngredientNutrition(
          id,
          ingredient.quantity,
          ingredient.unit
        );
        // exit loop
        found = true;
        // create object
        const nutritionObject = createNutritionObject(
          ingredient,
          id,
          nutrition
        );
        // create local storage element
        localStorage.setItem(
          `${ingredient.description}`,
          JSON.stringify(nutritionObject)
        );

        return nutritionObject;
      } else if (title.split(' ').length > 1) {
        // shorten query to try to find ingredient
        title = title.split(' ').slice(1).join(' ');
      } else {
        // set ingredient title to know in future that this ingredient doesn't exists
        // exit if nothing was found
        ('Nothing was found!');
        console.log(createNutritionObject(title));
        const nutritionObject = createNutritionObject(title);

        localStorage.setItem(
          `${ingredient.description}`,
          JSON.stringify(nutritionObject)
        );
        return nutritionObject;
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

const createNutritionObject = function (ingredient, id = 0, nutrition) {
  return {
    id: id,
    description: ingredient.description,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    totalCalories: nutrition ? nutrition.totalCalories : 0,
    caloricBreakdown: nutrition
      ? nutrition.caloricBreakdown
      : {
          percentProtein: 0,
          percentFat: 0,
          percentCarbs: 0,
        },
  };
};

const getIngredientNutrition = async function (id, amount = 1, unit = 'piece') {
  try {
    // get nutrition data
    const data = await AJAX(
      `${NUTRIENT_API_URL}${id}/information?amount=${amount}&unit=${unit}&apiKey=${NUTRIENT_KEY}`
    );
    // exit if data is not found
    if (!data || !data.nutrition) return;

    const calories = data.nutrition.nutrients.find(
      el => el.name === 'Calories'
    );

    return {
      totalCalories: calories ? calories.amount : 0,
      caloricBreakdown: data.nutrition.caloricBreakdown,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const countCaloricBreakdown = function (caloricBreakdown, totalCalories) {
  // change breakdown into values
  // total calories for 1 serving
  Object.keys(caloricBreakdown).forEach(function (key) {
    caloricBreakdown[key] = countCalories(caloricBreakdown[key], totalCalories);
  });
};

const getPercentage = function (count, total) {
  return +((count * 100) / total).toFixed(1);
};

const countCalories = function (percentage, totalCalories) {
  return +((percentage * totalCalories) / 100).toFixed(1);
};
