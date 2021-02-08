const http = require('http');
const DEFAULT_PORT = 3000;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

const { join } = require('path');
const CarService = require('./carService');
const carsDatabase = join(__dirname, './../../database', 'cars.json');

const repositoryFactory = () => {
  return new CarService({ file: carsDatabase });
}

class Api {
  constructor(carService = repositoryFactory()) {
    this.carService = carService;
  }

  generateRoutes() {
    return {
      '/getAvailableCar:get': async (request, response) => {

        for await (const data of request) {
          const carCategory = JSON.parse(data);
          const car = await this.carService.getAvailableCar(carCategory);

          if (!car || !carCategory) {
            response.writeHead(401, DEFAULT_HEADERS);
            response.write('Data invalid!');
            return response.end();
          }

          response.writeHead(200, DEFAULT_HEADERS);
          response.write(JSON.stringify({ result: car }));
          return response.end();
        }
      },

      '/calculateFinalPrice:post': async (request, response) => {

        for await (const data of request) {
          const { customer, carCategory, numberOfDays } = JSON.parse(data);

          if (!customer || !carCategory || !numberOfDays) {
            response.writeHead(401, DEFAULT_HEADERS);
            response.write('Data invalid!');
            return response.end();
          }

          const finalPrice = this.carService.calculateFinalPrice(customer, carCategory, numberOfDays);

          response.writeHead(200, DEFAULT_HEADERS);
          response.write(JSON.stringify({ result: finalPrice }));
          return response.end();
        }
      },

      '/rent:post': async (request, response) => {

        for await (const data of request) {
          const { customer, carCategory, numberOfDays } = JSON.parse(data);

          if (!customer.id || !carCategory.id || !numberOfDays) {
            response.writeHead(401, DEFAULT_HEADERS);
            response.write("Data invalid!");
            return response.end();
          }

          const transaction = await this.carService.rent(customer, carCategory, numberOfDays);

          response.writeHead(200, DEFAULT_HEADERS);
          response.write(JSON.stringify({ result: transaction }));
          return response.end();
        }
      },

      default: (request, response) => {
        response.write('404 Page does not exists');
        return response.end();
      },
    }
  }

  handler(request, response) {
    const { url, method } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;

    const routes = this.generateRoutes();
    const chosen = routes[routeKey] || routes.default;

    response.writeHead(200, DEFAULT_HEADERS, {
      'Content-Type': 'text/html',
    })

    return chosen(request, response);
  }

  init(port = DEFAULT_PORT) {
    const app = http.createServer(this.handler.bind(this)).listen(port, () => console.log(`app running at ${port}`));

    return app;
  }
}

module.exports = Api;

