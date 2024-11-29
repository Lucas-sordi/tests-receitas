import { validateSchema, request } from '../../utils/index';
import { createUserAndDoLogin, createRecipe } from '../../utils/helpers';
import { Recipes } from '../../fixtures/factory/recipes.factory';

describe("GET Filtro de receitas pelo nome - /recipes/search?name=", () => {
  let authToken = 'Bearer ';
  const recipeData = Recipes.generateRecipe();
  let recipeId;

  beforeAll(async () => {
    authToken += await createUserAndDoLogin();
  });

  beforeEach(async () => {
    recipeId = await createRecipe(recipeData, authToken);
  });

  test("deve filtrar a receita com sucesso pelo nome em minusculo", async () => {
    const name = recipeData.name.toLowerCase();

    const res = await request.get(`/recipes/search`)
      .query({ name: name })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/searchByName');
    res.body.forEach(recipe => {
      expect(recipe.name.toLowerCase()).toContain(name.toLowerCase());
    });
  });

  test("deve filtrar a receita com sucesso pelo nome em maisculo", async () => {
    const name = recipeData.name.toUpperCase();

    const res = await request.get(`/recipes/search`)
      .query({ name: name })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/searchByName');
    res.body.forEach(recipe => {
      expect(recipe.name.toUpperCase()).toContain(name.toUpperCase());
    });
  });

  test("deve filtrar a receita com sucesso pelo nome incompleto", async () => {
    const name = recipeData.name.substring(0, 5);

    const res = await request.get(`/recipes/search`)
      .query({ name: name })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/searchByName');

    res.body.forEach(recipe => {
      expect(recipe.name).toContain(name);
    });
  });

  test("deve retornar um array vazio devido a não ter resultados para o nome filtrado", async () => {
    const invalidName = '0909123103210309_teste091209'
    const res = await request.get(`/recipes/search`)
      .query({ name: invalidName })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/searchByName');
    expect(res.body).toEqual([]);
  });

});