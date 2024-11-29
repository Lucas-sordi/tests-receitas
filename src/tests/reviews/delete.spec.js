import { validateSchema, request } from '../../utils/index';
import { createUserAndDoLogin, createRecipe, createReview } from '../../utils/helpers';

describe("DELETE Exclusão de avaliação - /reviews", () => {
  let authToken = 'Bearer ';
  let recipeId;
  let reviewId;

  beforeAll(async () => {
    authToken += await createUserAndDoLogin();
  });

  beforeEach(async () => {
    recipeId = await createRecipe(undefined, authToken);
    reviewId = await createReview(undefined, recipeId, authToken);
  });

  test("deve excluir avaliação com sucesso", async () => {
    const res = await request.delete(`/reviews/${reviewId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'reviews/delete');
    expect(res.body.message).toEqual('Review deleted successfully');
  });

  test("deve retornar erro devido a falta do Authorization Token", async () => {
    const res = await request.delete(`/reviews/${reviewId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

  test("deve retornar erro devido ao reviewId não existir", async () => {
    const invalidId = -1;

    const res = await request.delete(`/reviews/${invalidId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`Review with id ${invalidId} not found`);
    expect(res.body.error).toEqual('Not Found');
  });

  test("deve retornar erro devido a avaliação pertencer a outro usuário", async () => {
    let secAuthToken = 'Bearer ';
    secAuthToken += await createUserAndDoLogin();

    const res = await request.delete(`/reviews/${reviewId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', secAuthToken);

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

});