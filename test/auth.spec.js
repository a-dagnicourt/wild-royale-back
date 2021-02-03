const supertest = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prismaClient');

// AUTH
describe('POST methods for auth', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/auth/login')
      .send({
        email: 'admin@wildroyale.fr',
      })
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / error (user not found)', async () => {
    const res = await supertest(app)
      .post('/api/v0/auth/login')
      .send({
        email: 'fail@wildroyale.fr',
        password: 'P@ssw0rd',
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / error (invalid password)', async () => {
    const res = await supertest(app)
      .post('/api/v0/auth/login')
      .send({
        email: 'admin@wildroyale.fr',
        password: 'F41lP@ssw0rd',
      })
      .expect(401)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/auth/login')
      .send({
        email: 'admin@wildroyale.fr',
        password: 'P@ssw0rd',
      })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('token');
  });
});
afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
