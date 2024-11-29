import { validateSchema, request } from '../../utils/index';
import { Reviews } from '../../fixtures/factory/reviews.factory';
import { createUserAndDoLogin, createRecipe, createReview } from '../../utils/helpers';

describe("GET Busca das avaliações de uma receita - /reviews/findReviewsOfRecipe/{id}", () => {

  test("deve buscar as avaliações da receita com sucesso", async () => {
    let authToken = 'Bearer ', secAuthToken = 'Bearer ';
    authToken += await createUserAndDoLogin();
    secAuthToken += await createUserAndDoLogin();

    const recipeId = await createRecipe(undefined, authToken);

    const reviewData = Reviews.generateReview();
    const secReviewData = Reviews.generateReview();
    const reviewId = await createReview(reviewData, recipeId, authToken);
    const secReviewId = await createReview(secReviewData, recipeId, secAuthToken);

    const res = await request.get(`/reviews/findReviewsOfRecipe/${recipeId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'reviews/getRecipeReviews');
    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(reviewId);
    expect(res.body[0].avaliation).toEqual(reviewData.avaliation);
    expect(res.body[0].comment).toEqual(reviewData.comment);
    expect(res.body[1].id).toEqual(secReviewId);
    expect(res.body[1].avaliation).toEqual(secReviewData.avaliation);
    expect(res.body[1].comment).toEqual(secReviewData.comment);
  });

  test("deve retornar erro devido ao recipeId não existir", async () => {
    const invalidId = -1;

    const res = await request.get(`/reviews/findReviewsOfRecipe/${invalidId}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`Recipe with id ${invalidId} not found`);
    expect(res.body.error).toEqual('Not Found');
  });
  
});