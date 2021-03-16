const assert = require('assert');

// Usado na maioria das vezes para listas de itens únicos.
const arr1 = ["0", "1", "2"];
const arr2 = ["2", "0", "3"];
const arr3 = arr1.concat(arr2);
// console.log('arr3', arr3.sort());
assert.deepStrictEqual(arr3.sort(), ['0', '0', '1', '2', '2', '3']);

const set = new Set();
arr1.forEach(item => set.add(item))
arr2.forEach(item => set.add(item))
// console.log('Set com add', set);
assert.deepStrictEqual([...set], ['0', '1', '2', '3']);
assert.deepStrictEqual(Array.from(new Set([...arr1, ...arr2])), ['0', '1', '2', '3']);

// console.log('set.keys', set.keys());
// console.log('set.values', set.values()); // Retorna o mesmo que o Keys, só existe por conta do Map

// No Array comum, para saber se um item existe
// [].indexOf(1) !== -1 ou [0].includes(0)
assert.ok(set.has('1'));

// Mesma teoria do Map, mas você trabalha com a Lista toda
// não tem get, então você pode saber se o item está ou não no Array e é isso.
// Na documentação tem exemplos sobre como fazer uma intersecção, saber o que tem em uma
// e não na outra e assim por diante.

// Tem nos dois arrays
const users1 = new Set([
  'erick',
  'mariazinha',
  'xuxa da silva',
])

const users2 = new Set([
  'erick',
  'joaozinho',
  'julio',
])

const intersection = new Set([...users1].filter(user => users2.has(user)));
assert.deepStrictEqual([...intersection], ['erick']);

const difference = new Set([...users1].filter(user => !users2.has(user)));
assert.deepStrictEqual([...difference], ['mariazinha', 'xuxa da silva']);

// WeakSet

// Mesma ideia do weakMap
// não é enumerável (iterável)
// Só trabalha com chaves como referência
// Só tem métodos simples

const user = { id: 123 };
const weakSet = new WeakSet([user]);

const user2 = { id: 234 };
weakSet.add(user2);
weakSet.delete(user);
weakSet.has(user);





