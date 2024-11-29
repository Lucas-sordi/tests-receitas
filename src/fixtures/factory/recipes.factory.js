import { faker } from '@faker-js/faker';

export class Recipes {
  static generateRecipe() {
    const newRecipe = {
      name: faker.commerce.productName(),
      ingredients: Array.from({ length: faker.number.int({ min: 2, max: 10 }) }, () => faker.commerce.productMaterial()),
      instructions: faker.lorem.sentences(),
      preparationTime: faker.number.int({ min: 1, max: 30 }),
      cookingTime: faker.number.int({ min: 1, max: 120 }),
      servings: faker.number.int({ min: 1, max: 5 }),
    };

    return newRecipe;
  };
};