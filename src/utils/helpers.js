import { request } from './index';
import { Auth } from '../fixtures/factory/auth.factory';
import { Recipes } from '../fixtures/factory/recipes.factory';
import { Reviews } from '../fixtures/factory/reviews.factory';

export const createUserAndDoLogin = async (userData = Auth.generateUser()) => {
  const resCreateUser = await request.post("/auth/register")
    .send(userData)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (resCreateUser.status !== 201) {
    throw new Error('Falha ao criar usuário');
  }

  const resLogin = await request.post("/auth/login")
    .send({ username: userData.username, password: userData.password })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (resLogin.status !== 201) {
    throw new Error('Falha ao fazer login');
  }

  return resLogin.body.access_token;
};

export const createRecipe = async (recipeData = Recipes.generateRecipe(), authToken) => {
  const resCreateRecipe = await request.post('/recipes')
    .send(recipeData)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', authToken);

  if (resCreateRecipe.status !== 201) {
    throw new Error('Falha ao criar receita');
  };

  return resCreateRecipe.body.id;
};

export const createReview = async (reviewData = Reviews.generateReview(), recipeId, authToken) => {
  const resCreateReview = await request.post('/reviews')
    .send({ ...reviewData, recipeId })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', authToken);

  if (resCreateReview.status !== 201) {
    throw new Error('Falha ao criar avaliação');
  };

  return resCreateReview.body.id;
};