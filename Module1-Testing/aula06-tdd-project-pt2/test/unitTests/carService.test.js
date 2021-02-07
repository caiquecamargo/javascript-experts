const { describe, it, before, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const CarSercive = require('./../../src/service/carService');

const { join } = require('path');

const carsDatabase = join(__dirname, './../../database', 'cars.json');

const mocks = {
  validCarCategory: require('./../mocks/valid-carCategory.json'),
  validCar: require('./../mocks/valid-car.json'),
  validCarCategory: require('./../mocks/valid-carCategory.json'),
}

describe('CarService Suite Tests', () => {
  let carService = {};
  let sandbox = {};

  before(() => {
    carService = new CarSercive({
      cars: carsDatabase,
    });
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should retrieve a random position from an array', () => {
    const data = [0, 1, 2, 3, 4];
    const result = carService.getRandomPositionFromArray(data);

    expect(result).to.be.lte(data.length).and.be.gte(0);
  })
  it('should choose the first id from carIds in carCategory', () => {
    const carCategory = mocks.validCarCategory;
    const carIndex = 0;

    sandbox.stub(carService, carService.getRandomPositionFromArray.name).returns(carIndex);

    const result = carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIndex];

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  })
  it('given a carCategory it should return an avilable car', async () => {
    const car = mocks.validCar;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandbox.stub(carService.carRepository, carService.carRepository.find.name).resolves(car);
    sandbox.spy(carService, carService.chooseRandomCar.name);

    const result = await carService.getAvailableCar(carCategory);
    const expected = car;

    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  })
})