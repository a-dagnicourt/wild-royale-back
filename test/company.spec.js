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

// COMPANIES GET
describe('GET methods for companies', () => {
  it('GET /api/v0/companies', async () => {
    await supertest(app)
      .get('/api/v0/companies')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/companies/:id', () => {
  it('GET / error (user not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/companies/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/companies/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});
// COMPANIES POST
describe('POST methods for companies', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/companies')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/companies')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: "O'Connor @-Net Company",
        SIRET_number: '12345678912340',
        VAT_number: 'FR12123456780',
        city: 'Saint-Germain en Laie',
        zip_code: '40400',
        street: "404, route de l'erreur, BIS 2, Bât 3",
        country: 'FR',
      })
      .expect(201)
      .expect('Content-Type', /json/);
    const expected = {
      id: 2,
      label: "O'Connor @-Net Company",
      SIRET_number: '12345678912340',
      VAT_number: 'FR12123456780',
      city: 'Saint-Germain en Laie',
      zip_code: '40400',
      street: "404, route de l'erreur, BIS 2, Bât 3",
      country: 'FR',
    };
    expect(res.body).toEqual(expected);
  });
});
// COMPANIES PUT
describe('PUT methods for companies', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/companies/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: "O'Connor @-Net Company",
        SIRET_number: '12345678912340',
        VAT_number: 'FR12123456780',
        city: 'Saint-Germain en Laie',
        zip_code: '40400',
        street: "404, route de l'erreur, BIS 2, Bât 3",
        country: 'FR',
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/companies/2')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/companies/2')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        label: "O'Connor @-Net Company",
        SIRET_number: '12345678912340',
        VAT_number: 'FR12123456780',
        city: 'Saint-Germain en Laie',
        zip_code: '40400',
        street: "404, route de l'erreur, BIS 2, Bât 3",
        country: 'FR',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const expected = {
      id: 2,
      label: "O'Connor @-Net Company",
      SIRET_number: '12345678912340',
      VAT_number: 'FR12123456780',
      city: 'Saint-Germain en Laie',
      zip_code: '40400',
      street: "404, route de l'erreur, BIS 2, Bât 3",
      country: 'FR',
    };
    expect(res.body).toEqual(expected);
  });
});

// COMPANIES DELETE
describe('DELETE methods for companies', () => {
  it('DELETE / error (wrong id)', async () => {
    const res = await supertest(app)
      .delete('/api/v0/companies/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('DELETE / OK (company successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/companies/2')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
