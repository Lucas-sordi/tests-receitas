import { validateSchema, request } from '../../utils/index';
import { Auth } from '../../fixtures/factory/auth.factory';

describe("POST Cadastro de usuário - /auth/register", () => {
  
  test("deve cadastrar um usuário com sucesso", async () => {
    const data = Auth.generateUser();

    const res = await request.post('/auth/register')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(201);
    expect(res.body.username).toEqual(data.username);
    expect(res.body.firstName).toEqual(data.firstName);
    expect(res.body.lastName).toEqual(data.lastName);

    validateSchema(res.body, 'auth/register');
  });

  test("deve retornar erro devido a senha não conter 8 digitos", async () => {
    let data = Auth.generateUser();
    data.password = 'asd1234';

    const res = await request.post('/auth/register')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400);
    expect(res.body.message).toContain('Password must be at least 8 characters and include at least one letter and one number');
  });

  test("deve retornar erro devido a senha não conter pelo menos uma letra", async () => {
    let data = Auth.generateUser();
    data.password = '123321123';

    const res = await request.post('/auth/register')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400);
    expect(res.body.message).toContain('Password must be at least 8 characters and include at least one letter and one number');
  });

  test("deve retornar erro devido a senha não conter pelo menos 1 número", async () => {
    let data = Auth.generateUser();
    data.password = 'asdasdasd';

    const res = await request.post('/auth/register')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400);
    expect(res.body.message).toContain('Password must be at least 8 characters and include at least one letter and one number');
  });
  
});