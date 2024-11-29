import { validateSchema, request } from '../../utils/index';
import { Reviews } from '../../fixtures/factory/reviews.factory';
import { createUserAndDoLogin, createRecipe, createReview } from '../../utils/helpers';

describe("GET Busca de avaliações por id - /reviews/{id}", () => {

  test("deve buscar a avaliação com sucesso", async () => {
    let authToken = 'Bearer ';
    authToken += await createUserAndDoLogin();
    const recipeId = await createRecipe(undefined, authToken);
    const reviewData = Reviews.generateReview();
    const reviewId = await createReview(reviewData, recipeId, authToken);

    const res = await request.get(`/reviews/${reviewId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'reviews/getById');
    expect(res.body.avaliation).toEqual(reviewData.avaliation);
    expect(res.body.comment).toEqual(reviewData.comment);
    expect(res.body.recipeId).toEqual(recipeId);
  });

  test("deve retornar erro devido ao reviewId não existir", async () => {
    const invalidId = -1;

    const res = await request.get(`/reviews/${invalidId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`Review with id ${invalidId} not found`);
    expect(res.body.error).toEqual('Not Found');
  });
  
});