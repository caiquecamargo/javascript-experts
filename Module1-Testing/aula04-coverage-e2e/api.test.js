const { describe, it } = require('mocha');
const request = require('supertest');
const app = require('./api');
const assert = require('assert');

describe('App Suite test', () => {
  describe('/contact', () => {
    it('should request the contact page and return HTTP Status 200', async () => {
      const response = await request(app).get('/contact').expect(200);

      assert.deepStrictEqual(response.text, 'contact us page')
    })
  })

  describe('/hello', () => {
    it('should request an innexistent route /hi and redirect to /hello', async () => {
      const response = await request(app).get('/hi').expect(200);

      assert.deepStrictEqual(response.text, 'Hello World');
    })
  })

  describe('/login', () => {
    it('should login succesfully on the login route and return HTTP Status 200', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'Caique de Camargo', password: '123' })
        .expect(200);

      assert.deepStrictEqual(response.text, 'Logging has succeded!');
    })

    it('should unathorize a request it using wrong credentials and return HTTP Status 401', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'balbal', password: '1234' })
        .expect(401);

      assert.ok(response.unauthorized);
      assert.deepStrictEqual(response.text, 'Logging Failed!');
    })
  })
})