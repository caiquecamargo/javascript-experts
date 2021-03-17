'use strict'

const assert = require('assert');
const Event = require('events');

const event = new Event();
const eventName = 'counter';
event.on(eventName, msg => console.log('counter updated', msg));

const myCounter = {
  counter: 0,
}

const proxy = new Proxy(myCounter, {
  set: (target, propertKey, newValue) => {
    event.emit(eventName, { newValue, key: target[propertKey] });
    target[propertKey] = newValue;

    return true;
  },
  get: (object, prop) => {
    // console.log('chamou', { object, prop });
    return object[prop];
  }
})

setInterval(function () {
  proxy.counter++;
  console.log('[3]: setInterval');
  if (proxy.counter === 10) clearInterval(this);
}, 500);

// Futuro
setTimeout(() => {
  proxy.counter = 4;
  console.log('[2]: setTimeout');
}, 100);

//Se quer que executa agora
setImmediate(() => {
  console.log('[1]: setImmediate', proxy.counter);
})


// Executa agora, agorinha, mas acaba com o cilclo de vida do node
process.nextTick(() => {
  proxy.counter = 2;
  console.log('[0]: nextTick');
})