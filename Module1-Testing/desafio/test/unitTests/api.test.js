const { describe, it } = require('mocha');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('./../../src/service/api');
const CarService = require('../../src/service/carService');

const { join } = require('path');
const carsDatabase = join(__dirname, './../../database', 'cars.json');

const mocks = {
  validCarCategory: require('./../mocks/valid-carCategory.json'),
  validCar: require('./../mocks/valid-car.json'),
  validCustomer: require('./../mocks/valid-customer.json'),
}

describe('App Test Suite', () => {
  describe('/rent', () => {

    let carService = {};
    before(() => {
      carService = new CarService({
        cars: carsDatabase,
      });
    })

    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })

    afterEach(() => {
      sandbox.restore();
    })

    it('should request the rent route with a valid customer, carCategory and numberOfDays and return HTTP Status 200 with a transaction', async () => {
      const car = mocks.validCar;
      const customer = {
        ...mocks.validCustomer,
        age: 30,
      }

      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
        carIds: [car.id],
      }

      const numberOfDays = 10;

      sandbox.stub(carService.carRepository, carService.carRepository.find.name).resolves(car);

      const messageToSend = {
        customer,
        carCategory,
        numberOfDays,
      }
      const response = await request(app).post('/rent').send(JSON.stringify(messageToSend)).expect(200);

      const result = JSON.parse(response.text);

      const expected = await carService.rent(customer, carCategory, numberOfDays);

      expect(result).to.be.deep.equal(expected);
    })
  })
})