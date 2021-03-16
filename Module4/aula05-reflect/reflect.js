'use strict'

const assert = require('assert');

// ----- apply
const myObj = {
  add(myValue) {
    return this.arg1 + this.arg2 + myValue;
  }
}

// Function.prototype.apply = () => { throw new TypeError('Eita!') };
// myObj.add.apply = function () { throw new TypeError('Aqui acontece!') };

assert.deepStrictEqual(myObj.add.apply({ arg1: 10, arg2: 20 }, [100]), 130);

// Um problema que pode acontecer (raro)
// Function.prototype.apply = () => {throw new TypeError('Eita!')};

// Esse aqui pode acontecer
myObj.add.apply = function () { throw new TypeError('Aqui acontece!') };

assert.throws(() => myObj.add.apply({}, []), {
  name: 'TypeError',
  message: 'Aqui acontece!',
});

const result = Reflect.apply(myObj.add, { arg1: 40, arg2: 20 }, [200]);
assert.deepStrictEqual(result, 260);
// ------ apply

// ------ defineProperty

// Questões semânticas
function myDate() { };

// Feio pra KCT
Object.defineProperty(myDate, 'withObject', { value: () => 'Hey There!' });

// Ainda feio pra KCT mas melhor
Reflect.defineProperty(myDate, 'withReflection', { value: () => 'Hey Dude!' });

assert.deepStrictEqual(myDate.withObject(), 'Hey There!');
assert.deepStrictEqual(myDate.withReflection(), 'Hey Dude!');
// ------ defineProperty

// ------ deleteProperty
const withDelete = { user: 'Caique de Camargo' };
// imperformático, EVITAR AO MÀXIMO
delete withDelete.user;

assert.deepStrictEqual(withDelete.hasOwnProperty('user'), false);

const withReflection = { user: 'xuxa da silva' };
Reflect.deleteProperty(withReflection, 'user');
assert.deepStrictEqual(withReflection.hasOwnProperty('user'), false);
// ------ deleteProperty

// Deveríamos fazer um get somente em instâncias de referência
assert.deepStrictEqual(1['username'], undefined);
// com Reflection uma exceção é lançada
assert.throws(() => Reflect.get(1, 'username'), TypeError);
// ------ get

assert.ok('superman' in { superman: '' });
assert.ok(Reflect.has({ batman: '' }, 'batman'));
// ------ has

// ------ ownKeys 
const user = Symbol('user');
const myObj2 = {
  id: 1,
  [Symbol.for('password')]: 123,
  [user]: 'Caique de Camargo'
}

// Com os métodos de object temos que fazer duas requisições
const objectKeys = [
  ...Object.getOwnPropertyNames(myObj2),
  ...Object.getOwnPropertySymbols(myObj2),
]
assert.deepStrictEqual(objectKeys, ['id', Symbol.for('password'), user]);

// com Reflection só um método
assert.deepStrictEqual(Reflect.ownKeys(myObj2), ['id', Symbol.for('password'), user]);