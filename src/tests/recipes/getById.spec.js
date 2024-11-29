import { validateSchema, request } from '../../utils/index';
import { Recipes } from '../../fixtures/factory/recipes.factory';
import { createRecipe, createUserAndDoLogin } from '../../utils/helpers';

describe("GET Busca de receitas por id - /recipes/{id}", () => {
  let authToken = 'Bearer ';
  const recipeData = Recipes.generateRecipe();
  let recipeId;

  beforeAll(async () => {
    authToken += await createUserAndDoLogin();
    recipeId = await createRecipe(recipeData, authToken);
  });

  test("deve buscar a receita com sucesso", async () => {
    const res = await request.get(`/recipes/${recipeId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/getById');
    expect(res.body.name).toEqual(recipeData.name);
    expect(res.body.cookingTime).toEqual(recipeData.cookingTime);
    expect(res.body.ingredients).toEqual(recipeData.ingredients);
    expect(res.body.instructions).toEqual(recipeData.instructions);
    expect(res.body.preparationTime).toEqual(recipeData.preparationTime);
    expect(res.body.servings).toEqual(recipeData.servings);
  });

  test("deve retornar erro devido ao recipeId não existir", async () => {
    const invalidId = -1;

    const res = await request.get(`/recipes/${invalidId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`Recipe with id ${invalidId} not found`);
    expect(res.body.error).toEqual('Not Found');
  });

});