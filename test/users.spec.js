const supertest = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prismaClient');
const { hashPassword } = require('../src/util');

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

// USERS GET
describe('GET methods for users', () => {
  it('GET /api/v0/users', async () => {
    await supertest(app)
      .get('/api/v0/users')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/users/:id', () => {
  it('GET / error (user not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/users/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/users/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});
// USERS POST
describe('POST methods for users', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: 'jeantest@wcs.fr',
        password: hashPassword('P@ssw0rdÿ'),
        firstname: 'José Michel',
        lastname: "O'Connor",
        isAdmin: false,
      })
      .expect(201)
      .expect('Content-Type', /json/);
    const expected = {
      id: 3,
      email: 'jeantest@wcs.fr',
      firstname: 'José Michel',
      lastname: "O'Connor",
      isAdmin: false,
    };
    expect(res.body).toEqual(expected);
  });
});
// USERS PUT
describe('PUT methods for users', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/users/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        password: hashPassword('P@ssw0rdÿ'),
        email: 'jeantest@wcs.fr',
        firstname: 'José Michel',
        lastname: "O'Connor",
        isAdmin: false,
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/users/3')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/users/3')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        password: hashPassword('P@ssw0rdÿ'),
        email: 'jeantest@wcs.fr',
        firstname: 'José Michel',
        lastname: "O'Connor",
        isAdmin: false,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const expected = {
      id: 3,
      email: 'jeantest@wcs.fr',
      firstname: 'José Michel',
      lastname: "O'Connor",
      isAdmin: false,
    };
    expect(res.body).toEqual(expected);
  });
});
// USERS DELETE
describe('DELETE methods for users', () => {
  // Deactivated due to use of raw SQL query in user route

  // it('DELETE / error (wrong id)', async () => {
  //   const res = await supertest(app)
  //     .delete('/api/v0/users/0')
  //     .set({ Authorization: `Bearer ${token}` })
  //     .expect(404)
  //     .expect('Content-Type', /json/);
  //   expect(res.body).toHaveProperty('message');
  // });
  it('DELETE / OK (user successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/users/3')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
