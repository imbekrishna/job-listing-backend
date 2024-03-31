import app from '../../app';
import supertest from 'supertest';
import { expect, describe, beforeAll, afterAll, it } from 'vitest';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

let firstUserIdTest = '';
const firstUserBody = {
  email: `firstUser+${nanoid()}@mail.com`,
  password: 'sup3rSecret!23',
};

let accessToken = '';
let refreshToken = '';
let newFirstName = 'Jose';
let newFirstName2 = 'Paulo';
let newLastName2 = 'Faraco';

describe('users and auth endpoints', () => {
  let request;
  beforeAll(() => {
    request = supertest.agent(app);
  });

  it('should allow a POST to /users', async function () {
    const res = await request.post('/users').send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('string');
    firstUserIdTest = res.body.id;
  });

  it('should allow a POST to /auth', async function () {
    const res = await request.post('/auth').send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.accessToken).to.be.a('string');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });
  it('should allow a GET from /users/:userId with an access token', async function () {
    const res = await request
      .get(`/users/${firstUserIdTest}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('string');
    expect(res.body.id).to.equal(firstUserIdTest);
    expect(res.body.email).to.equal(firstUserBody.email);
  });
  afterAll((done) => {
    app.close(() => mongoose.connection.close());
  });
});
