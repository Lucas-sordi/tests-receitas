import { validateSchema, request } from '../../utils/index';
import { Auth } from '../../fixtures/factory/auth.factory';

describe("POST Login - /auth/login", () => {
  const userData = Auth.generateUser();

  beforeAll(async () => {
    const resCreateUser = await request.post('/auth/register')
      .send(userData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(resCreateUser.status).toEqual(201);
  });

  test("deve fazer login com sucesso", async () => {
    const res = await request.post('/auth/login')
      .send({ username: userData.username, password: userData.password })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'auth/login');
  });

  test("deve retornar erro devido a credenciais inválidas", async () => {
    const res = await request.post('/auth/login')
      .send({ username: userData.username, password: 'invalid-password' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual('Invalid credentials');
    });
    
});