const assert = require('assert');

const uniqueKey = Symbol('username');
const user = {};

user['username'] = 'value for normal objects';
user[uniqueKey] = 'value for symbol';

// console.log('getting normal objects', user.username);
// console.log('getting normal objects', user[Symbol('username')]);
// console.log('getting symbol objects', user[uniqueKey]);

assert.deepStrictEqual(user.username, 'value for normal objects');
//Sempre único em nível de endereço de memória
assert.deepStrictEqual(user[Symbol('username')], undefined);
assert.deepStrictEqual(user[uniqueKey], 'value for symbol');

const firstKey = Symbol('teste');
const secondKey = Symbol('teste');
assert.deepStrictEqual(firstKey === secondKey, false);

assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

// byPass - má prática (Não tem nem no repositório do Node)
user[Symbol.for('password')] = '123';
assert.deepStrictEqual(user[Symbol.for('password')], '123');

const symbol1 = Symbol.for('symbol1');
const symbol2 = Symbol.for('symbol1');
assert.deepStrictEqual(symbol1 === symbol2, true);

// Well Known Symbols
const obj = {
  // iterators
  [Symbol.iterator]: () => ({
    items: ['c', 'b', 'a'],
    next() {
      return {
        done: this.items.length === 0,
        value: this.items.pop(),
      }
    }
  })
}

// for (const item of obj) {
//   console.log('item', item);
// }

assert.deepStrictEqual([...obj], ['a', 'b', 'c']);

const kItems = Symbol('kItems');
class MyDate {
  constructor(...args) {
    this[kItems] = args.map(arg => new Date(...arg));
  }

  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== 'string') throw new TypeError();

    const items = this[kItems].map(item => new Intl.DateTimeFormat("pt-BR", { month: "long", day: "2-digit", year: "numeric" }).format(item));

    return new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" }).format(items);
  }

  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  async *[Symbol.asyncIterator]() {
    const timeout = ms => new Promise(r => setTimeout(r, ms));
    for (const item of this[kItems]) {
      await timeout(100);
      yield item.toISOString();
    }
  }

  get [Symbol.toStringTag]() {
    return 'WHAT?'
  }
}

const myDate = new MyDate(
  [2020, 03, 01],
  [2020, 03, 02],
)

const expectedDates = [
  new Date(2020, 03, 01),
  new Date(2020, 03, 02),
]

// console.log('myDate', myDate);
assert.deepStrictEqual(Object.prototype.toString.call(myDate), '[object WHAT?]');
// console.log('myDate + ', myDate + 1);
assert.throws(() => myDate + 1, TypeError);

//coercao explicita para chamar o toPrimitive
assert.deepStrictEqual(String(myDate), '01 de abril de 2020 e 02 de abril de 2020')

// Implementar o iterator
assert.deepStrictEqual([...myDate], expectedDates);

// ; (async () => {
//   for await (const item of myDate) {
//     console.log('asyncIterator', item);
//   }
// })();

// Chama o Symbol.iterator e não o async iterator
; (async () => {
  const dates = await Promise.all([...myDate]);
  assert.deepStrictEqual(dates, expectedDates)
})();

; (async () => {
  const dates = []
  for await (const date of myDate) { dates.push(date) }
  const expectedDatesInISOString = expectedDates.map(item => item.toISOString())

  assert.deepStrictEqual(dates, expectedDatesInISOString)
})();