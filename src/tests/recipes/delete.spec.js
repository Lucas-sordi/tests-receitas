import { validateSchema, request } from '../../utils/index';
import { createUserAndDoLogin, createRecipe } from '../../utils/helpers';

describe("DELETE Exclusão de Receita - /recipes/{id}", () => {
  let authToken = 'Bearer ';
  let recipeId;

  beforeAll(async () => {
    authToken += await createUserAndDoLogin();
  });

  beforeEach(async () => {
    recipeId = await createRecipe(undefined, authToken);
  });

  test("deve excluir receita com sucesso", async () => {
    const res = await request.delete(`/recipes/${recipeId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/delete');
    expect(res.body.message).toEqual('Recipe deleted successfully');
  });

  test("deve retornar erro devido a falta do Authorization Token", async () => {
    const res = await request.delete(`/recipes/${recipeId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

  test("deve retornar erro devido ao recipeId não existir", async () => {
    const invalidId = -1;

    const res = await request.delete(`/recipes/${invalidId}`)
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

    const res = await request.delete(`/recipes/${recipeId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', secAuthToken);

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

});