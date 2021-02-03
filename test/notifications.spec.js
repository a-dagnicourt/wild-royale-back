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

// NOTIFICATIONS GET
describe('GET methods for notifications', () => {
  it('GET /api/v0/notifications', async () => {
    await supertest(app)
      .get('/api/v0/notifications')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/notifications/:id', () => {
  it('GET / error (user not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/notifications/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/notifications/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});
// NOTIFICATIONS POST
describe('POST methods for notifications', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/notifications')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/notifications')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        zone: 'Pays Basque',
        vertical_trade: 'Kebabier',
        sms: false,
        email: true,

        id_user: 1,
      })
      .expect(201)
      .expect('Content-Type', /json/);
    const expected = {
      id: 2,
      zone: 'Pays Basque',
      vertical_trade: 'Kebabier',
      sms: false,
      email: true,

      id_user: 1,
    };
    expect(res.body).toEqual(expected);
  });
});
// NOTIFICATIONS PUT
describe('PUT methods for notifications', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/notifications/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        zone: 'BAB',
        vertical_trade: 'Maître Kebabier',
        sms: false,
        email: true,

        id_user: 1,
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/notifications/2')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/notifications/2')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        zone: 'BAB',
        vertical_trade: 'Maître Kebabier',
        sms: false,
        email: true,

        id_user: 1,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const expected = {
      id: 2,
      zone: 'BAB',
      vertical_trade: 'Maître Kebabier',
      sms: false,
      email: true,

      id_user: 1,
    };
    expect(res.body).toEqual(expected);
  });
});
// NOTIFICATIONS DELETE
describe('DELETE methods for notifications', () => {
  it('DELETE / error (wrong id)', async () => {
    const res = await supertest(app)
      .delete('/api/v0/notifications/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('DELETE / OK (notification successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/notifications/2')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
