import { validateSchema, request } from '../../utils/index';
import { Recipes } from '../../fixtures/factory/recipes.factory';
import { createUserAndDoLogin } from '../../utils/helpers';

describe("POST Cadastro de Receita - /recipes", () => {
  let authToken = 'Bearer ';

  beforeAll(async () => {
    authToken += await createUserAndDoLogin();
  });

  test("deve cadastrar receita com sucesso", async () => {
    const data = Recipes.generateRecipe();

    const res = await request.post('/recipes')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(201);
    validateSchema(res.body, 'recipes/create');
  });

  test("deve retornar erro devido a falta do Authorization Token", async () => {
    const data = Recipes.generateRecipe();

    const res = await request.post('/recipes')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

});