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

// PROPERTIES GET
describe('GET methods for properties', () => {
  it('GET /api/v0/properties', async () => {
    await supertest(app)
      .get('/api/v0/properties')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/properties/:id', () => {
  it('GET / error (user not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/properties/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/properties/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});
// PROPERTIES POST
describe('POST methods for properties', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/properties')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/properties')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: "Château del'arte",
        lat: '-10.0000',
        long: '100.0000',
        pictureUrl:
          'https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg',
        pictureAlt: "The incredible del'arte Castle !",
      })
      .expect(201)
      .expect('Content-Type', /json/);
    const expected = {
      id: 6,
      label: "Château del'arte",
      lat: '-10.0000',
      long: '100.0000',
    };
    expect(res.body).toEqual(expected);
  });
});
// PROPERTIES PUT
describe('PUT methods for properties', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/properties/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: "Château del'arte de-la tour",
        lat: '-10.0000',
        long: '100.0000',
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/properties/6')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/properties/6')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: "Château del'arte de-la tour",
        lat: '-10.0000',
        long: '100.0000',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const expected = {
      id: 6,
      label: "Château del'arte de-la tour",
      lat: '-10.0000',
      long: '100.0000',
    };
    expect(res.body).toEqual(expected);
  });
});

// PROPERTIES DELETE
describe('DELETE methods for properties', () => {
  it('DELETE / error (wrong id)', async () => {
    const res = await supertest(app)
      .delete('/api/v0/properties/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('DELETE / OK (company successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/properties/6')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
