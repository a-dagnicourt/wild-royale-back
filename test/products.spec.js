const supertest = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prismaClient');

let token;

beforeAll((done) => {
  supertest(app)
    .post('/api/v0/auth/login')
    .send({
      email: 'nblicq@followthemarket.fr',
      password: 'P@ssw0rd',
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

// PRODUCTS GET
describe('GET methods for products', () => {
  it('GET /api/v0/products', async () => {
    await supertest(app)
      .get('/api/v0/products')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/products/:id', () => {
  it('GET / error (product not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/products/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/products/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});
// PRODUCTS POST
describe('POST methods for products', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/products')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/products')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: 'ftest',
      })
      .expect(201)
      .expect('Content-Type', /json/);
    const expected = {
      id: 5,
      label: 'ftest',
    };
    expect(res.body).toEqual(expected);
  });
});
// PRODUCTS PUT
describe('PUT methods for products', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/products/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: 'fttest',
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/products/5')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/products/5')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: 'fttest',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const expected = {
      id: 5,
      label: 'fttest',
    };
    expect(res.body).toEqual(expected);
  });
});
// PRODUCTS DELETE
describe('DELETE methods for products', () => {
  it('DELETE / error (wrong id)', async () => {
    const res = await supertest(app)
      .delete('/api/v0/products/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('DELETE / OK (product successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/products/5')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
