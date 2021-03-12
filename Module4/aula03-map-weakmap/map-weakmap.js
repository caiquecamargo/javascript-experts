const assert = require('assert');

const myMap = new Map();

// Pode ser qualquer coise como chave;
myMap
  .set(1, 'one')
  .set('Erick', { text: 'two' })
  .set(true, () => 'hello')

// console.log(myMap)
assert.deepStrictEqual(myMap.get(1), 'one');
assert.deepStrictEqual(myMap.get('Erick'), { text: 'two' });
assert.deepStrictEqual(myMap.get(true)(), 'hello');

// Em Objects as chaves só podem string ou Symbol
const onlyReferenceWorks = { id: 1 };
myMap.set(onlyReferenceWorks, { name: 'Caique de Camargo' });
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), { name: 'Caique de Camargo' });
