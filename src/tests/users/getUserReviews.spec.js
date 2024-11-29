import { validateSchema, request } from '../../utils/index';
import { createRecipe, createReview, createUserAndDoLogin } from '../../utils/helpers';
import { Reviews } from '../../fixtures/factory/reviews.factory';

describe("GET Buscar avaliações do usuário - /user/reviews", () => {

  test("deve buscar todas as avaliações criadas pelo usuário logado com sucesso", async () => {
    let authToken = 'Bearer ';
    authToken += await createUserAndDoLogin();

    const reviewData = Reviews.generateReview(), secReviewData = Reviews.generateReview();
    const recipeId = await createRecipe(undefined, authToken);
    const secRecipeId = await createRecipe(undefined, authToken);
    const reviewId = await createReview(reviewData, recipeId, authToken);
    const secReviewId = await createReview(secReviewData, secRecipeId, authToken);

    const res = await request.get('/user/reviews')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'users/getUserReviews');
    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(reviewId);
    expect(res.body[0].recipeId).toEqual(recipeId);
    expect(res.body[0].avaliation).toEqual(reviewData.avaliation);
    expect(res.body[0].comment).toEqual(reviewData.comment);
    expect(res.body[1].id).toEqual(secReviewId);
    expect(res.body[1].recipeId).toEqual(secRecipeId);
    expect(res.body[1].avaliation).toEqual(secReviewData.avaliation);
    expect(res.body[1].comment).toEqual(secReviewData.comment);
  });

  test("deve retornar erro devido a falta do Authorization Token", async () => {
    const res = await request.get('/user/reviews')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual('Unauthorized');
  });

});