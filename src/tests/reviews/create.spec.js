import { validateSchema, request } from '../../utils/index';
import { Reviews } from '../../fixtures/factory/reviews.factory';
import { createUserAndDoLogin, createRecipe } from '../../utils/helpers';

describe("POST Cadastro de avaliação - /reviews", () => {
  let authToken = 'Bearer ';
  let recipeId;

  beforeAll(async () => {
    authToken += await createUserAndDoLogin();
  });

  beforeEach(async () => {
    recipeId = await createRecipe(undefined, authToken);
  });

  test("deve adicionar avaliação com sucesso", async () => {
    const data = Reviews.generateReview();

    const res = await request.post('/reviews')
      .send({ ...data, recipeId })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(201);
    validateSchema(res.body, 'reviews/create');
  });

  test("deve adicionar avaliação sem comentário com sucesso", async () => {
    const data = Reviews.generateReview();

    const res = await request.post('/reviews')
      .send({ ...data, comment: null, recipeId })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(201);
    validateSchema(res.body, 'reviews/create');
  });

  test("ao avaliar a mesma receita, a avaliação anterior deve ser substituída", async () => {
    const data = Reviews.generateReview();

    const resCreate = await request.post('/reviews')
      .send({ ...data, recipeId })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(resCreate.status).toEqual(201);
    validateSchema(resCreate.body, 'reviews/create');

    const newData = Reviews.generateReview();
    const resUpdate = await request.post('/reviews')
      .send({...newData, recipeId })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(resUpdate.status).toEqual(201);
    validateSchema(resUpdate.body, 'reviews/create');
    expect(resUpdate.body.id).toEqual(resCreate.body.id);
    expect(resUpdate.body.createdAt).toEqual(resCreate.body.createdAt);
    expect(resUpdate.body.updatedAt).not.toEqual(resCreate.body.updatedAt);
    expect(resUpdate.body.avaliation).toEqual(newData.avaliation);
    expect(resUpdate.body.comment).toEqual(newData.comment);
    expect(resUpdate.body.recipeId).toEqual(recipeId);

  });

  test("deve retornar erro devido ao avaliation ser maior que 5", async () => {
    const res = await request.post('/reviews')
      .send({ avaliation: 6, recipeId })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(400);
    expect(res.body.message).toContain('avaliation must not be greater than 5');
  });

  test("deve retornar erro devido ao avaliation ser menor que 0", async () => {
    const res = await request.post('/reviews')
      .send({ avaliation: 0, recipeId })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(400);
    expect(res.body.message).toContain('avaliation must not be less than 1');
  });

  test("deve retornar erro devido a falta do Authorization Token", async () => {
    const data = Reviews.generateReview();

    const res = await request.post('/reviews')
      .send({ ...data, recipeId })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

  test("deve retornar erro devido ao recipeId não existir", async () => {
    const invalidId = -1;
    const data = Reviews.generateReview();

    const res = await request.post('/reviews')
      .send({ ...data, recipeId: invalidId })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual(`Recipe with id ${invalidId} not found`);
    expect(res.body.error).toEqual('Not Found');
  });

});