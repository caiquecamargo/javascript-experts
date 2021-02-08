const { describe, it } = require('mocha');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const api = require('./../../src/service/api');
const CarService = require('../../src/service/carService');

const { join } = require('path');
const carsDatabase = join(__dirname, './../../database', 'cars.json');

const mocks = {
  validCarCategory: require('./../mocks/valid-carCategory.json'),
  validCar: require('./../mocks/valid-car.json'),
  validCustomer: require('./../mocks/valid-customer.json'),
}

describe('END2END API Test Suite', () => {
  let sandbox = {}
  let app = {}

  before(() => {
    const carService = new CarService({ cars: carsDatabase });
    const instance = new api(carService);

    app = {
      instance,
      server: instance.init(),
    }
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore();
  })

  describe('/getAvailableCar:get', () => {
    it('should request the getAvailableCar route with a valid carCategory and return HTTP 200 with a car', async () => {
      const car = mocks.validCar;

      const carCategory = {
        ...mocks.validCarCategory,
        carIds: [car.id],
      };

      sandbox.stub(
        app.instance.carService.carRepository,
        app.instance.carService.carRepository.find.name,
      ).resolves(car)

      const response = await request(app.server).get('/getAvailableCar').send(carCategory).expect(200);
      const expected = { result: car }

      expect(response.body).to.be.deep.equal(expected);
    })
  })

  describe('/calculateFinalPrice:post', () => {
    it('should request calculateFinalPrice route with a customer, a carCategory and the numberOfDays, returns a HTTP 200 with totalPrice', async () => {
      const customer = {
        ...mocks.validCustomer,
        age: 50,
      }

      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
      }

      const numberOfDays = 5;

      const messageToSend = {
        customer,
        carCategory,
        numberOfDays,
      }

      sandbox.stub(app.instance.carService, 'taxBasedOnAge').get(() => [{ from: 40, to: 50, then: 1.3 }]);

      const response = await request(app.server).post('/calculateFinalPrice').send(JSON.stringify(messageToSend)).expect(200);
      const expected = { result: app.instance.carService.currencyFormat.format(244.40) };

      expect(response.body).to.be.deep.equal(expected);
    })
  })

  describe('/rent:post', () => {

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

      sandbox.stub(app.instance.carService.carRepository, app.instance.carService.carRepository.find.name).resolves(car);

      const messageToSend = {
        customer,
        carCategory,
        numberOfDays,
      }
      const response = await request(app.server).post('/rent').send(JSON.stringify(messageToSend)).expect(200);

      const expected = { result: await app.instance.carService.rent(customer, carCategory, numberOfDays) };

      expect(response.body).to.be.deep.equal(expected);
    })
  })
})