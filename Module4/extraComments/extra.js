/**
 * Exemplos citados no artigo https://www.keithcirkel.co.uk/metaprogramming-in-es6-part-3-proxies/
 */

'use strict'

const assert = require('assert');

// URL BUILDER (Using FluentAPI)

function urlBuilder(domain) {
  console.log("----> Criando o objeto")
  var parts = [];
  var proxy = new Proxy(function () {
    var returnValue = domain + '/' + parts.join('/');
    console.log('----> chamei aqui', returnValue);
    parts = [];
    return returnValue;
  }, {
    has: function () {
      console.log('----> chamou o has')
      return true;
    },
    get: function (object, prop) {
      parts.push(prop);
      console.log('----> chamou o get', prop, parts)
      return proxy;
    },
  });
  console.log('---> Objeto criado', proxy())
  return proxy;
}
var google = urlBuilder('http://google.com');
console.log(google.base.search())
assert(google.search.products.bacon.and.eggs() === 'http://google.com/search/products/bacon/and/eggs')

// Object.observes pattern

function observe(object, observerCallback) {
  var observing = true;
  const proxyObject = new Proxy(object, {
    set: function (object, property, value) {
      var hadProperty = Reflect.has(object, property);
      var oldValue = hadProperty && Reflect.get(object, property);
      var returnValue = Reflect.set(object, property, value);
      if (observing && hadProperty) {
        observerCallback({ object: proxyObject, type: 'update', name: property, oldValue: oldValue });
      } else if (observing) {
        observerCallback({ object: proxyObject, type: 'add', name: property });
      }
      return returnValue;
    },
    deleteProperty: function (object, property) {
      var hadProperty = Reflect.has(object, property);
      var oldValue = hadProperty && Reflect.get(object, property);
      var returnValue = Reflect.deleteProperty(object, property);
      if (observing && hadProperty) {
        observerCallback({ object: proxyObject, type: 'delete', name: property, oldValue: oldValue });
      }
      return returnValue;
    },
    defineProperty: function (object, property, descriptor) {
      var hadProperty = Reflect.has(object, property);
      var oldValue = hadProperty && Reflect.getOwnPropertyDescriptor(object, property);
      var returnValue = Reflect.defineProperty(object, property, descriptor);
      if (observing && hadProperty) {
        observerCallback({ object: proxyObject, type: 'reconfigure', name: property, oldValue: oldValue });
      } else if (observing) {
        observerCallback({ object: proxyObject, type: 'add', name: property });
      }
      return returnValue;
    },
    preventExtensions: function (object) {
      var returnValue = Reflect.preventExtensions(object);
      if (observing) {
        observerCallback({ object: proxyObject, type: 'preventExtensions' })
      }
      return returnValue;
    },
  });
  return { object: proxyObject, unobserve: function () { observing = false } };
}

var changes = [];
var observer = observe({ id: 1 }, (change) => changes.push(change));
var object = observer.object;
var unobserve = observer.unobserve;
object.a = 'b';
object.id++;
Object.defineProperty(object, 'a', { enumerable: false });
delete object.a;
Object.preventExtensions(object);
unobserve();
object.id++;
assert.strictEqual(changes.length, 5);
assert.strictEqual(changes[0].object, object);
assert.strictEqual(changes[0].type, 'add');
assert.strictEqual(changes[0].name, 'a');
assert.strictEqual(changes[1].object, object);
assert.strictEqual(changes[1].type, 'update');
assert.strictEqual(changes[1].name, 'id');
assert.strictEqual(changes[1].oldValue, 1);
assert.strictEqual(changes[2].object, object);
assert.strictEqual(changes[2].type, 'reconfigure');
assert.strictEqual(changes[2].oldValue.enumerable, true);
assert.strictEqual(changes[3].object, object);
assert.strictEqual(changes[3].type, 'delete');
assert.strictEqual(changes[3].name, 'a');
assert.strictEqual(changes[4].object, object);
assert.strictEqual(changes[4].type, 'preventExtensions');

console.log(changes)