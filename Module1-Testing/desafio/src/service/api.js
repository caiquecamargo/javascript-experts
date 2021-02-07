const http = require('http');
const PORT = 3000;

const { join } = require('path');
const CarService = require('./carService');
const carsDatabase = join(__dirname, './../../database', 'cars.json');
const carService = new CarService({ cars: carsDatabase });

const routes = {
  '/rent:post': async (request, response) => {

    for await (const data of request) {
      const { customer, carCategory, numberOfDays } = JSON.parse(data);

      if (!customer.id || !carCategory.id || !numberOfDays) {
        response.writeHead(401);
        response.write("Data invalid!");
        return response.end();
      }

      const transaction = await carService.rent(customer, carCategory, numberOfDays);

      response.writeHead(200);
      response.write(JSON.stringify(transaction));
      return response.end();
    }
  },

  default: (request, response) => {
    response.write('404 Page does not exists');
    return response.end();
  },
}

const handler = function (request, response) {
  const { url, method } = request;
  const routeKey = `${url}:${method.toLowerCase()}`;
  const chosen = routes[routeKey] || routes.default;

  response.writeHead(200, {
    'Content-Type': 'text/html',
  })

  return chosen(request, response);
}

const app = http.createServer(handler).listen(PORT, () => console.log('app running at 3000'));

module.exports = app;

