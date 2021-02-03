const supertest = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prismaClient');

let token;

beforeAll((done) => {
  supertest(app)
    .post('/api/v0/auth/login')
    .send({
      email: 'admin@wildroyale.fr',
      password: 'P@ssw0rd',
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

// RESERVATIONS POST
describe('POST methods for reservations', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/reservations')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/reservations')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        property: 1,
        user: 1,
        start_date: '2021-01-01T00:00:00.000Z',
        end_date: '2021-01-01T00:00:00.000Z',
      })
      .expect(201)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id_user');
  });
});

// RESERVATIONS GET
describe('GET methods for reservations', () => {
  it('GET /api/v0/reservations', async () => {
    await supertest(app)
      .get('/api/v0/reservations')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/reservations/:id', () => {
  it('GET / error (user not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/reservations/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/reservations/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});

// RESERVATIONS PUT
describe('PUT methods for reservations', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/reservations/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        property: 1,
        user: 1,
        start_date: '2021-01-01T00:00:00.000Z',
        end_date: '2021-01-01T00:00:00.000Z',
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/reservations/1')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/reservations/1')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        property: 1,
        user: 1,
        start_date: '2021-01-01T00:00:00.000Z',
        end_date: '2021-01-01T00:00:00.000Z',
      })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id_user');
  });
});
// RESERVATIONS DELETE
describe('DELETE methods for reservations', () => {
  // Deactivated due to use of raw SQL query in user route

  // it('DELETE / error (wrong id)', async () => {
  //   const res = await supertest(app)
  //     .delete('/api/v0/reservations/0')
  //     .set({ Authorization: `Bearer ${token}` })
  //     .expect(404)
  //     .expect('Content-Type', /json/);
  //   expect(res.body).toHaveProperty('message');
  // });
  it('DELETE / OK (user successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/reservations/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
