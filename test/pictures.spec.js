const express = require('express');
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

/// PICTURES UPLOAD POST
// let uploadPath = '';
// describe('POST methods for pictures media upload', () => {
//   it('POST / error (bad file type)', async () => {
//     const res = await supertest(app)
//       .post('/api/v0/pictures/upload')
//       .attach('media', './public/media/test.mpg')
//       .expect(403)
//       .expect('Content-Type', /json/);
//     expect(res.body).toHaveProperty('message');
//     uploadPath = res.body.path;
//   });
//   it('POST / OK (file uploaded)', async () => {
//     const res = await supertest(app)
//       .post('/api/v0/pictures/upload')
//       .attach('media', './public/media/test.jpg')
//       .expect(201)
//       .expect('Content-Type', /json/);
//     expect(res.body).toHaveProperty('path');
//     uploadPath = res.body.path;
//   });
// });
// PICTURES GET
describe('GET methods for pictures', () => {
  it('GET /api/v0/pictures', async () => {
    await supertest(app)
      .get('/api/v0/pictures')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
describe('GET /api/v0/pictures/:id', () => {
  it('GET / error (user not found)', async () => {
    const res = await supertest(app)
      .get('/api/v0/pictures/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('stack');
  });
  it('GET / OK (fields provided)', async () => {
    const res = await supertest(app)
      .get('/api/v0/pictures/1')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id');
  });
});
// PICTURES POST
describe('POST methods for pictures', () => {
  it('POST / error (fields missing)', async () => {
    const res = await supertest(app)
      .post('/api/v0/pictures')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('POST / OK (fields provided)', async () => {
    const res = await supertest(app)
      .post('/api/v0/pictures')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        url:
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        alt: 'Lorem ipsum',
        property: 5,
      })
      .expect(201)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id_property');
  });
});
// PICTURES PUT
describe('PUT methods for pictures', () => {
  it('PUT / error (wrong id)', async () => {
    const res = await supertest(app)
      .put('/api/v0/pictures/0')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        url:
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        alt: 'Lorem ipsum',
        property: 5,
      })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / error (fields missing)', async () => {
    const res = await supertest(app)
      .put('/api/v0/pictures/6')
      .set({ Authorization: `Bearer ${token}` })
      .send({})
      .expect(422)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('PUT / OK (fields provided)', async () => {
    const res = await supertest(app)
      .put('/api/v0/pictures/6')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        url:
          'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large_2.png',
        alt: 'Lorem ipsum updated',
        property: 5,
      })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('id_property');
  });
});
// PICTURES DELETE
describe('DELETE methods for pictures', () => {
  it('DELETE / error (wrong id)', async () => {
    const res = await supertest(app)
      .delete('/api/v0/pictures/0')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /json/);
    expect(res.body).toHaveProperty('message');
  });
  it('DELETE / OK (user successfully deleted)', async () => {
    await supertest(app)
      .delete('/api/v0/pictures/6')
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});
