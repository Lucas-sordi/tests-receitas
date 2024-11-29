import { validateSchema, request } from '../../utils/index';

describe("GET Busca de receitas paginado - /recipes?page=", () => {

  test("deve buscar as receitas com sucesso", async () => {
    const page = 1;

    const res = await request.get(`/recipes`)
      .query({ page: page })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/getAll');
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
    expect(res.body.page).toEqual(page);
    expect(res.body.limit).toEqual(10);
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body).toHaveProperty('totalItems');

    for (let i = 1; i < res.body.data.length; i++) {
      const previousItem = res.body.data[i - 1];
      const currentItem = res.body.data[i];
      expect(new Date(previousItem.createdAt).getTime()).toBeLessThanOrEqual(new Date(currentItem.createdAt).getTime());
    };
  });

  test("deve retornar o array data vazio pois 'page' é um valor muito alto", async () => {
    const page = 76575756;

    const res = await request.get(`/recipes`)
      .query({ page: page })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    validateSchema(res.body, 'recipes/getAll');
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toEqual(0);
    expect(res.body.page).toEqual(page);
    expect(res.body.limit).toEqual(10);
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body).toHaveProperty('totalItems');
  });

});