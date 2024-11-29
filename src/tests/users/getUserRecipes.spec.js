import { validateSchema, request } from '../../utils/index';
import { createRecipe, createUserAndDoLogin } from '../../utils/helpers';
import { Recipes } from '../../fixtures/factory/recipes.factory';

describe("GET Buscar receitas do usuário - /user/recipes", () => {

  test("deve buscar todas as receitas criadas pelo usuário logado com sucesso", async () => {
    let authToken = 'Bearer ';
    authToken += await createUserAndDoLogin();
    const recipeData = Recipes.generateRecipe(), secRecipeData = Recipes.generateRecipe();
    const recipeId = await createRecipe(recipeData, authToken);
    const secRecipeId = await createRecipe(secRecipeData, authToken);

    const res = await request.get('/user/recipes')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'users/getUserRecipes');
    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(recipeId);
    expect(res.body[0].name).toEqual(recipeData.name);
    expect(res.body[0].ingredients).toEqual(recipeData.ingredients);
    expect(res.body[0].instructions).toEqual(recipeData.instructions);
    expect(res.body[0].preparationTime).toEqual(recipeData.preparationTime);
    expect(res.body[0].cookingTime).toEqual(recipeData.cookingTime);
    expect(res.body[0].servings).toEqual(recipeData.servings);
    expect(res.body[1].id).toEqual(secRecipeId);
    expect(res.body[1].name).toEqual(secRecipeData.name);
    expect(res.body[1].ingredients).toEqual(secRecipeData.ingredients);
    expect(res.body[1].instructions).toEqual(secRecipeData.instructions);
    expect(res.body[1].preparationTime).toEqual(secRecipeData.preparationTime);
    expect(res.body[1].cookingTime).toEqual(secRecipeData.cookingTime);
    expect(res.body[1].servings).toEqual(secRecipeData.servings);
  });

  test("deve retornar erro devido a falta do Authorization Token", async () => {
    const res = await request.get('/user/recipes')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual('Unauthorized');
  });

});