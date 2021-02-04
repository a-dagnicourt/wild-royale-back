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

// FAMILIES GET
describe('GET methods for families', () => {
  it('GET /api/v0/families', async () => {
    await supertest(app)
      .get('/api/v0/families')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/families/:id', () => {
  it('GET / error (user not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/families/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/families/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});
// FAMILIES POST
describe('POST methods for families', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/families')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/families')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        firstname: 'Jean-Edouard',
        lastname: 'Test de la Haute',
        linkedin: 'https://www.linkedin.com/in/jetestdlhaute',
        github: 'https://github.com/jetestdlhaute',
        zone: 'BAB',
        picture:
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      })
      .expect(201)
      .expect('Content-Type', /json/);
    const expected = {
      id: 17,
      firstname: 'Jean-Edouard',
      lastname: 'Test de la Haute',
      linkedin: 'https://www.linkedin.com/in/jetestdlhaute',
      github: 'https://github.com/jetestdlhaute',
      zone: 'BAB',
      picture:
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    };
    expect(res.body).toEqual(expected);
  });
});
// FAMILIES PUT
describe('PUT methods for families', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/families/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        firstname: 'Jean-Edouard',
        lastname: 'Test de la Haute',
        linkedin: 'https://www.linkedin.com/in/jetestdlhaute',
        github: 'https://github.com/jetestdlhaute',
        zone: 'BAB',
        picture:
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/families/17')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/families/17')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        firstname: 'Jean-Edouard',
        lastname: 'Test de la Haute',
        linkedin: 'https://www.linkedin.com/in/jetestdlhaute',
        github: 'https://github.com/jetestdlhaute',
        zone: 'BAB',
        picture:
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const expected = {
      id: 17,
      firstname: 'Jean-Edouard',
      lastname: 'Test de la Haute',
      linkedin: 'https://www.linkedin.com/in/jetestdlhaute',
      github: 'https://github.com/jetestdlhaute',
      zone: 'BAB',
      picture:
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    };
    expect(res.body).toEqual(expected);
  });
});
// FAMILIES DELETE
describe('DELETE methods for families', () => {
  it('DELETE / error (wrong id)', async () => {
    const res = await supertest(app)
      .delete('/api/v0/families/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('DELETE / OK (user successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/families/17')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
