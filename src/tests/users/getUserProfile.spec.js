import { validateSchema, request } from '../../utils/index';
import { createUserAndDoLogin } from '../../utils/helpers';
import { Auth } from '../../fixtures/factory/auth.factory';

describe("GET Buscar perfil do usuário - /user/profile", () => {

  test("deve buscar o perfil do usuário logado com sucesso", async () => {
    let authToken = 'Bearer ';
    const userData = Auth.generateUser();
    authToken += await createUserAndDoLogin(userData);

    const res = await request.get('/user/profile')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', authToken);

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'users/getUserProfile');
    expect(res.body.username).toEqual(userData.username);
    expect(res.body.firstName).toEqual(userData.firstName);
    expect(res.body.lastName).toEqual(userData.lastName);
  });

  test("deve retornar erro devido a falta do Authorization Token", async () => {
    const res = await request.get('/user/profile')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual('Unauthorized');
  });

});