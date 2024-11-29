import { validateSchema, request } from '../../utils/index';
import { Recipes } from '../../fixtures/factory/recipes.factory';
import { createUserAndDoLogin, createRecipe } from '../../utils/helpers';

describe("PUT Atualização de Receita - /recipes/{id}", () => {
  let authToken = 'Bearer ';
  let recipeId;

  beforeAll(async () => {
    authToken += await createUserAndDoLogin();
  });
  
  beforeEach(async () => {
    recipeId = await createRecipe(undefined, authToken);
  });

  test("deve atualizar receita com sucesso", async () => {
    const data = Recipes.generateRecipe();

    const res = await request.put(`/recipes/${recipeId}`)
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/update');
    expect(res.body.message).toEqual('Recipe updated successfully');
  });

  test("deve retornar erro devido a falta do Authorization Token", async () => {
    const data = Recipes.generateRecipe();

    const res = await request.put(`/recipes/${recipeId}`)
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

  test("deve retornar erro devido ao recipeId não existir", async () => {
    const invalidId = -1;
    const data = Recipes.generateRecipe();

    const res = await request.put(`/recipes/${invalidId}`)
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`Recipe with id ${invalidId} not found`);
    expect(res.body.error).toEqual('Not Found');
  });

  test("deve retornar erro devido a receita pertencer a outro usuário", async () => {
    let secAuthToken = 'Bearer ';
    secAuthToken += await createUserAndDoLogin();

    const data = Recipes.generateRecipe();

    const res = await request.put(`/recipes/${recipeId}`)
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', secAuthToken);

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

});