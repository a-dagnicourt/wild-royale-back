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

// ROLES GET
describe('GET methods for roles', () => {
  it('GET /api/v0/roles', async () => {
    await supertest(app)
      .get('/api/v0/roles')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/roles/:id', () => {
  it('GET / error (role not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/roles/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/roles/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});
// ROLES POST
describe('POST methods for roles', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/roles')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/roles')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: 'tester',
      })
      .expect(201)
      .expect('Content-Type', /json/);
    const expected = {
      id: 5,
      label: 'tester',
    };
    expect(res.body).toEqual(expected);
  });
});
// ROLES PUT
describe('PUT methods for roles', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/roles/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: 'supertester',
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/roles/5')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/roles/5')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: 'supertester',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const expected = {
      id: 5,
      label: 'supertester',
    };
    expect(res.body).toEqual(expected);
  });
});
// ROLES DELETE
describe('DELETE methods for roles', () => {
  it('DELETE / error (wrong id)', async () => {
    const res = await supertest(app)
      .delete('/api/v0/roles/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('DELETE / OK (role successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/roles/5')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
